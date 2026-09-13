const express = require("express");

const requireAdmin =
  require("../middleware/authMiddleware");

const upload =
  require("../middleware/uploadMiddleware");

const {
  uploadAnswer,
  getAllAnswers,
  getAnswerById,
  previewAnswerVideo,
  downloadAnswerVideo,
  deleteAnswer,
} = require("../controllers/answerController");

const router = express.Router();

/*
=====================================================
STUDENT ANSWER UPLOAD
POST /api/interviews/upload-answer
=====================================================
*/

router.post(
  "/interviews/upload-answer",
  upload.single("video"),
  uploadAnswer
);

/*
=====================================================
GET ALL ANSWERS
GET /api/admin/answers
=====================================================
*/

router.get(
  "/admin/answers",
  requireAdmin,
  getAllAnswers
);

/*
=====================================================
GET SINGLE ANSWER
GET /api/admin/answers/:id
=====================================================
*/

router.get(
  "/admin/answers/:id",
  requireAdmin,
  getAnswerById
);

/*
=====================================================
VIDEO PREVIEW
GET /api/admin/answers/:id/video
=====================================================
*/

router.get(
  "/admin/answers/:id/video",
  requireAdmin,
  previewAnswerVideo
);

/*
=====================================================
VIDEO DOWNLOAD
GET /api/admin/answers/:id/download
=====================================================
*/

router.get(
  "/admin/answers/:id/download",
  requireAdmin,
  downloadAnswerVideo
);

/*
=====================================================
DELETE SINGLE ANSWER
DELETE /api/admin/answers/:id
=====================================================
*/

router.delete(
  "/admin/answers/:id",
  requireAdmin,
  deleteAnswer
);

module.exports = router;

export {};