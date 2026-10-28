const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Student = require("./models/Student");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Middleware ----------
app.use(express.json());

// ---------- Health Route ----------
app.get("/api/health", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// ==============================================
//  CRUD Routes – /api/students
// ==============================================

// GET all students
app.get("/api/students", async (_req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error("GET /api/students error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET one student by id
app.get("/api/students/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid student ID format" });
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    console.error("GET /api/students/:id error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// POST create a student
app.post("/api/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    const saved = await student.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: "Validation failed", details: messages });
    }
    console.error("POST /api/students error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT update a student
app.put("/api/students/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid student ID format" });
    }

    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: "Validation failed", details: messages });
    }
    console.error("PUT /api/students/:id error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a student
app.delete("/api/students/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid student ID format" });
    }

    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student deleted successfully", deleted: student });
  } catch (err) {
    console.error("DELETE /api/students/:id error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------- Connect to MongoDB, then start server ----------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
