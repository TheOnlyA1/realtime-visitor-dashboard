# Real-Time Visitor Dashboard

A real-time visitor tracking dashboard built with Node.js, Express, WebSocket, and MySQL.

## Features

- Comprehensive error logging
- RESTful API endpoints
- Environment-based configuration
- Real-time updates using WebSocket
- Persistent storage with MySQL database
- Clean and responsive UI using Tailwind CSS

## Prerequisites

Before you begin, ensure you have the following installed (ideally latest):

- Node.js
- MySQL
- npm

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd realtime-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Create a MySQL database using the provided schema:

```bash
mysql -u your_username -p < database.sql
```

4. Configure environment variables:
   - Copy the `.env.example` file to `.env`
   - Update the values according to your environment:

```
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=visitor_db
PORT=3000
```

## Running the Application

1. Start the server:

```bash
node app.js
```

2. Access the dashboard:

   - Open your browser and navigate to `http://localhost:3000`

3. Use Postman:
   - Open the application and send a request (the body) such as: '{
     "visitor_name": "clare jones",
     "status": "in"
     }'
     - this needs to be raw JSON and remember to set the content type application/json

## API Endpoints

### GET /api/visitors

- Retrieves all visitor entries in an array of objects

```json
[
  {
    "id": 1,
    "visitor_name": "John Doe",
    "status": "in",
    "timestamp": "2024-11-25T10:30:00"
  }
]
```

### POST /api/visitors

- Creates a new visitor entry
- Request body:

```json
{
  "visitor_name": "Bob Legend",
  "status": "in"
}
```

## WebSocket Events

The dashboard maintains a real-time connection with the server and automatically updates when:

- New visitor entries are created
- The page is loaded
- A client reconnects after disconnection

## Logging

The application uses Winston for logging:

- Error logs: `logs/error.log`
- Combined logs: `logs/combined.log`
- Console logging in non-production environments

## Troubleshooting

Common issues and solutions:

1. Database Connection Issues:

   - Verify MySQL is running
   - Check credentials in `.env`
   - Ensure database exists

2. WebSocket Connection Fails:
   - Check if the server is running
   - Verify port availability
   - Check browser console for errors
