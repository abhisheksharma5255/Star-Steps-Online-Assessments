const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  JWT_SECRET,
} = require("../config/env");

async function loginAdmin(
  req: any,
  res: any
) {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    const emailMatch =
      email.toLowerCase().trim() ===
      ADMIN_EMAIL.toLowerCase().trim();

    if (!emailMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    let passwordMatch = false;

    passwordMatch =
      password === ADMIN_PASSWORD;

    if (!passwordMatch) {
      try {
        passwordMatch =
          await bcrypt.compare(
            password,
            ADMIN_PASSWORD
          );
      } catch (error) {
        passwordMatch = false;
      }
    }

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        email: ADMIN_EMAIL,
        role: "admin",
      },
      JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    res.json({
      message: "Login successful",

      token,

      admin: {
        email: ADMIN_EMAIL,
        role: "admin",
      },
    });
  } catch (error) {
    console.error(
      "❌ Admin login failed:",
      error
    );

    res.status(500).json({
      message: "Login failed",
    });
  }
}

function getCurrentAdmin(
  req: any,
  res: any
) {
  res.json({
    authenticated: true,

    admin: {
      email:
        req.admin.email,

      role:
        req.admin.role,
    },
  });
}

module.exports = {
  loginAdmin,
  getCurrentAdmin,
};

export {};