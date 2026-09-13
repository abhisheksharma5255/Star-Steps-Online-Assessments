const express = require("express");

const requireAdmin =
  require("../middleware/authMiddleware");

const {
  loginAdmin,
  getCurrentAdmin,
} = require("../controllers/adminController");

const router = express.Router();

router.post(
  "/login",
  loginAdmin
);

router.get(
  "/me",
  requireAdmin,
  getCurrentAdmin
);

module.exports = router;

export {};