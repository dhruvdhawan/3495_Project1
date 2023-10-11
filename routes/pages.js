const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();
const mysql = require("mysql");
const multer = require("multer");
const path = require("path");

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DATABASE_USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

router.get("/", authController.isLoggedIn, (req, res) => {
  res.sendFile("main.html", { root: "./public/" });
});
router.get("/register", (req, res) => {
  res.sendFile("register.html", { root: "./public/" });
});
router.get("/login", (req, res) => {
  res.sendFile("login.html", { root: "./public/" });
});
router.get("/profile", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    const userId = req.user.id; // Access the user's ID
    // Use userId as needed, e.g., for database queries or rendering user-specific content
    req.session.userId = userId;
    res.render("profile", { userId }); // Pass userId as a local variable
  } else {
    res.redirect("/login");
  }
});

// Define storage for uploaded videos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/videos"); // Set the directory where videos will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/upload-video", upload.single("video"), (req, res) => {
  console.log(req.user, req.session.userIderId, "sadsa");

  const userId = req.session.userId; // You need to ensure that user information is available in the request
  const videoPath = req.file.filename;
  const insertQuery = "INSERT INTO videos (user_id, path) VALUES (?, ?)";

  db.query(insertQuery, [userId, videoPath], (err, results) => {
    if (err) {
      console.error("Error inserting video path:", err);
      res.status(500).send("Error uploading video");
    } else {
      console.log("Video path inserted into the database");
      // Redirect back to the profile page or display a success message
      res.redirect("/profile");
    }
  });
});

module.exports = router;

module.exports = router;
