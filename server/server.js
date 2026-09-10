import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({ path: "../.env" });

const app = express();

// Allow React frontend to communicate with backend
app.use(cors());

// Allow JSON data from the frontend
app.use(express.json());

// Connect to MySQL
const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "civicconnect",
  port: 3306,
});

console.log("✅ Connected to MySQL!");

// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    message: "CivicConnect backend is running!",
  });
});

// ==========================================
// GET ALL USERS
// ==========================================

app.get("/users", async (req, res) => {
  try {
    const [users] = await db.execute(
      "SELECT id, name, email, created_at FROM users"
    );

    res.json(users);
  } catch (error) {
    console.error("❌ Error getting users:", error);

    res.status(500).json({
      error: "Database error",
    });
  }
});

// ==========================================
// GET ALL CIVIC REPORTS
// ==========================================

app.get("/reports", async (req, res) => {
  try {
    const [reports] = await db.execute(
      "SELECT * FROM challenges ORDER BY created_at DESC"
    );

    res.json(reports);
  } catch (error) {
    console.error("❌ Error getting reports:", error);

    res.status(500).json({
      error: "Failed to get reports",
    });
  }
});

// ==========================================
// CREATE A NEW CIVIC REPORT
// ==========================================

app.post("/reports", async (req, res) => {
  try {
    const {
      id,
      title,
      description,
      category,
      severity,
      priorityScore,
      status,
      reporterId,
      reporterName,
      city,
      state,
      address,
      latitude,
      longitude,
    } = req.body;

    await db.execute(
      `INSERT INTO challenges
      (
        id,
        title,
        description,
        category,
        severity,
        priority_score,
        status,
        reporter_id,
        reporter_name,
        city,
        state,
        address,
        latitude,
        longitude
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        title,
        description,
        category,
        severity,
        priorityScore,
        status,
        reporterId,
        reporterName,
        city,
        state,
        address,
        latitude,
        longitude,
      ]
    );

    res.status(201).json({
      message: "Report saved successfully!",
      id: id,
    });
  } catch (error) {
    console.error("❌ Error saving report:", error);

    res.status(500).json({
      error: "Failed to save report",
    });
  }
});

// ==========================================
// START SERVER
// ==========================================

app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});