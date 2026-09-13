const express = require("express");

const requireAdmin =
  require("../middleware/authMiddleware");

const {
  getAllInterviews,
  createInterview,
  getInterviewById,
  deleteInterview,
} = require("../controllers/interviewController");

const router = express.Router();

/*
=====================================================
STUDENT CAN VIEW ALL INTERVIEWS
=====================================================
*/

router.get(
  "/",
  getAllInterviews
);

/*
=====================================================
ONLY ADMIN CAN CREATE INTERVIEW
=====================================================
*/

router.post(
  "/",
  requireAdmin,
  createInterview
);

/*
=====================================================
GET SINGLE INTERVIEW
=====================================================
*/

router.get(
  "/:id",
  getInterviewById
);

/*
=====================================================
DELETE COMPLETE ASSESSMENT
=====================================================

ADMIN ONLY
=====================================================
*/

router.delete(
  "/:id",
  requireAdmin,
  deleteInterview
);

module.exports = router;

export {};