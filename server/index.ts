require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const errorMiddleware = require("./middleware/errorMiddleware");

const adminRoutes = require("./routes/adminRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const answerRoutes = require("./routes/answerRoutes");

const app = express();

const PORT = process.env.PORT || 5008;

/*
=====================================================
MONGODB
=====================================================
*/

connectDB();

/*
=====================================================
APP MIDDLEWARE
=====================================================
*/

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/*
=====================================================
INTERVIEW ROUTES
=====================================================
*/

app.use(
  "/api/interviews",
  interviewRoutes
);

/*
=====================================================
ANSWER ROUTES
=====================================================
*/

app.use(
  "/api",
  answerRoutes
);

/*
=====================================================
ADMIN ROUTES
=====================================================
*/

app.use(
  "/api/admin",
  adminRoutes
);

/*
=====================================================
HOME / API HEALTH CHECK
=====================================================
*/

app.get(
  "/",
  (req, res) => {
    res.json({
      success: true,

      message:
        "Star Steps Online Assessments API is running 🚀",
    });
  }
);

/*
=====================================================
404 HANDLER
=====================================================
*/

app.use(
  (req, res) => {
    res.status(404).json({
      message:
        "API endpoint not found",
    });
  }
);

/*
=====================================================
GLOBAL ERROR HANDLER
=====================================================
*/

app.use(errorMiddleware);

/*
=====================================================
START SERVER
=====================================================
*/

app.listen(
  PORT,
  () => {
    console.log(
      "🚀 Star Steps Online Assessments API running on http://localhost:" +
        PORT
    );
  }
);