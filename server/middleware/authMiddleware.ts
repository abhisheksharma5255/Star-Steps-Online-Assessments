const jwt = require("jsonwebtoken");

const {
  JWT_SECRET,
} = require("../config/env");

function requireAdmin(
  req: any,
  res: any,
  next: any
) {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message:
          "Admin authentication required",
      });
    }

    const parts =
      authHeader.split(" ");

    if (
      parts.length !== 2 ||
      parts[0] !== "Bearer"
    ) {
      return res.status(401).json({
        message:
          "Invalid authorization format",
      });
    }

    const token =
      parts[1];

    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      );

    if (
      !decoded ||
      decoded.role !== "admin"
    ) {
      return res.status(403).json({
        message:
          "Admin access required",
      });
    }

    req.admin =
      decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message:
        "Invalid or expired admin token",
    });
  }
}

module.exports =
  requireAdmin;

export {};