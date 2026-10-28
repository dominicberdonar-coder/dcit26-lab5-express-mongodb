# DCIT 26 – Laboratory Exercise 5: Student Records REST API

A backend REST API built with **Node.js**, **Express**, **MongoDB**, and **Mongoose** that manages student records through full CRUD operations.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally, **or** a MongoDB Atlas connection string
- npm (comes with Node.js)

---

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/dominicberdonar-coder/dcit26-lab5-express-mongodb.git
   cd dcit26-lab5-express-mongodb
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy the example file and edit it if needed:

   ```bash
   cp .env.example .env
   ```

   Default `.env` contents:

   ```
   MONGODB_URI=mongodb://127.0.0.1:27017/lab5_students
   PORT=5000
   ```

   - For a **local** MongoDB installation, the default URI works as-is.
   - For **MongoDB Atlas**, replace `MONGODB_URI` with your cluster connection string.

4. **Start MongoDB** (if running locally)

   ```bash
   mongod
   ```

5. **Run the server**

   - Development (auto-restart on changes):

     ```bash
     npm run dev
     ```

   - Production:

     ```bash
     npm start
     ```

   The server will print:

   ```
   ✅ Connected to MongoDB
   🚀 Server running on http://localhost:5000
   ```

---

## API Routes

| Method   | Endpoint              | Description                        | Success Code |
| -------- | --------------------- | ---------------------------------- | ------------ |
| `GET`    | `/api/health`         | Health check                       | 200          |
| `GET`    | `/api/students`       | Retrieve all student records       | 200          |
| `GET`    | `/api/students/:id`   | Retrieve a single student by ID    | 200          |
| `POST`   | `/api/students`       | Create a new student record        | 201          |
| `PUT`    | `/api/students/:id`   | Update an existing student record  | 200          |
| `DELETE` | `/api/students/:id`   | Delete a student record            | 200          |

### Sample Request Body (POST / PUT)

```json
{
  "fullName": "Alex Santos",
  "course": "BSIT",
  "yearLevel": 2,
  "section": "IT-2A"
}
```

### Error Responses

| Code | Meaning                                      |
| ---- | -------------------------------------------- |
| 400  | Invalid input or malformed ID                |
| 404  | Student record not found                     |
| 500  | Unexpected server error                      |

---

## Student Model Schema

| Field       | Type     | Required | Constraints / Default        |
| ----------- | -------- | -------- | ---------------------------- |
| `fullName`  | String   | Yes      | Trimmed                      |
| `course`    | String   | Yes      | Trimmed                      |
| `yearLevel` | Number   | Yes      | Min: 1, Max: 4               |
| `section`   | String   | No       | Trimmed, defaults to `""`    |
| `createdAt` | Date     | No       | Defaults to current time     |

---

## Project Structure

```
lab5-student-api/
├── backend/
│   ├── models/
│   │   └── Student.js      # Mongoose schema & model
│   └── server.js            # Express app, routes, DB connection
├── .env                     # Local environment variables (not committed)
├── .env.example             # Environment variable template
├── .gitignore               # Ignores node_modules and .env
├── package.json             # Project metadata & npm scripts
├── package-lock.json        # Dependency lock file
└── README.md                # This file
```

---

## Testing

Use **Postman**, **Thunder Client**, or **curl** to test the endpoints.

### Example curl commands

```bash
# Health check
curl http://localhost:5000/api/health

# Create a student
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Alex Santos","course":"BSIT","yearLevel":2,"section":"IT-2A"}'

# Get all students
curl http://localhost:5000/api/students

# Get one student (replace <id> with actual MongoDB _id)
curl http://localhost:5000/api/students/<id>

# Update a student
curl -X PUT http://localhost:5000/api/students/<id> \
  -H "Content-Type: application/json" \
  -d '{"yearLevel":3,"section":"IT-3B"}'

# Delete a student
curl -X DELETE http://localhost:5000/api/students/<id>
```

Verify persistence by checking documents in **MongoDB Compass** or **mongosh**, and by restarting the server — records will still be there.

---

## Author

Dominic Berdonar — DCIT 26
