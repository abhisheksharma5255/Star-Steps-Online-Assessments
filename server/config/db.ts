const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log(
      "✅ MongoDB Atlas connected successfully"
    );
  } catch (error: any) {
    console.error(
      "❌ MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
}

module.exports = connectDB;

export {};