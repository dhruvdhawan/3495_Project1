const express = require("express");
const path = require("path");
const mysql = require("mysql");
const app = express();
const session = require("express-session");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");

const MAX_RETRIES = 10;
const RETRY_INTERVAL = 5000; // 5 seconds

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "html");

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DATABASE_USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

async function initializeDatabase() {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      db.connect();

      console.log("MYSQL CONNECTED");
      const createUsersTableQuery = `
          CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
          )`;

      db.query(createUsersTableQuery, (err) => {
        if (err) {
          console.error("Error creating the users table: " + err.message);
        } else {
          console.log("Users table created");
        }
      });

      db.query(
        "CREATE TABLE IF NOT EXISTS videos (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, path VARCHAR(255))",
        (err) => {
          if (err) {
            console.error("Error creating videos table:", err);
          } else {
            console.log("Videos table is ready.");
          }
        }
      );

      return;
    } catch (error) {
      console.error(`Failed to connect to database (attempt ${retries + 1}):`, error.message);
      retries++;
      await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
    }
  }
  throw new Error("Max retries reached. Failed to connect to database.");
}

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.set("view engine", "html");
app.use(
  session({
    secret: "session-user",
    resave: false,
    saveUninitialized: false,
  })
);

app.engine("html", require("ejs").renderFile);
// Define Routes
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

initializeDatabase()
  .then(() => {
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
