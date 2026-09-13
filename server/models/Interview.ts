const mongoose = require("mongoose");

/*
=====================================================
QUESTION SCHEMA
=====================================================
*/

const questionSchema =
  new mongoose.Schema(
    {
      text: {
        type: String,
        required: true,
        trim: true,
      },

      timeLimit: {
        type: Number,
        default: null,
      },
    },
    {
      _id: false,
    }
  );

/*
=====================================================
INTERVIEW SCHEMA
=====================================================
*/

const interviewSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      questions: {
        type: [questionSchema],
        default: [],
      },

      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

/*
=====================================================
MODEL
=====================================================
*/

const Interview =
  mongoose.model(
    "Interview",
    interviewSchema
  );

module.exports = Interview;

export {};