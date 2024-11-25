// Load environment variables
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { createPool } from "mysql2/promise";
import path from "path";
import logger from "./utils/logger.js";

logger.info("App started");

//to interact with db
const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  //for dev otherwise prod needs true and ssl setup
  ssl: { rejectUnauthorized: false },
});

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());
app.use(express.static(path.resolve("public")));

// websocket connection/handling
wss.on("connection", (ws) => {
  logger.info("WebSocket connection established");
  ws.on("error", (err) => logger.error("WebSocket error:", err));
});

//function to clear data
const clearVisitorData = async () => {
  try {
    await pool.query("DELETE FROM visitors");
    console.log("Visitor data cleared");
  } catch (err) {
    console.error("Error clearing visitor data", err);
    throw err;
  }
};

//function to get the visitor data stored
const fetchesVisitorData = async (ws) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM visitors ORDER BY timestamp DESC"
    );
    ws.send(JSON.stringify({ type: "visitors", data: rows }));
    logger.info("fetched data");
  } catch (err) {
    logger.error("Error fetching visitor data:", err);
  }
};

// function to update visitor data, using postman to actually update
const sendVisitorData = async () => {
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      await fetchesVisitorData(client);
    }
  }
};

//api endpoints
app
  .route("/api/visitors")
  .get(async (req, res) => {
    //fetches data
    try {
      const [rows] = await pool.query(
        "SELECT * FROM visitors ORDER BY timestamp DESC"
      );
      logger.info("Data retrieved");
      res.json(rows);
    } catch (err) {
      logger.error("Error fetching visitors", err);
      res.status(500).json({ error: "500 network error" });
    }
  })
  .post(async (req, res) => {
    //validate and updates / sends data
    const { visitor_name, status } = req.body;

    if (!visitor_name || !status || !["in", "out"].includes(status)) {
      return res.status(400).json({ error: "Failed to input" });
    }

    try {
      const query =
        "INSERT INTO visitors (visitor_name, status, timestamp) VALUES (?, ?, NOW())";
      await pool.query(query, [visitor_name, status]);
      logger.info(`New visitor ${visitor_name}, ${status}`);
      await sendVisitorData();
      res.json({ message: "Visitor created successfully" });
    } catch (err) {
      logger.error("Failed to add visitor", err);
      res.status(500).json({ error: "error" });
    }
  })
  .delete(async (req, res) => {
    try {
      // Clear the visitor data from the database
      await clearVisitorData();

      // Send a success message to the client making the DELETE request
      res.send("All visitors removed");

      // Optionally, notify all WebSocket clients about the data change
      for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "visitors", data: [] })); // Send empty array
        }
      }
    } catch (err) {
      console.error("Error deleting visitors", err);
      res.status(500).send("500 - Error deleting visitors");
    }
  });

app.get("/", (req, res) => {
  res.sendFile(path.resolve("public", "index.html"));
});

const port = process.env.PORT || 3000;
server.listen(port, () => logger.info(`Server on port ${port}`));
