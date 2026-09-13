const mongoose = require("mongoose");

/*
=====================================================
ANSWER SCHEMA
=====================================================
*/

const answerSchema =
  new mongoose.Schema(
    {
      studentName: {
        type: String,
        required: true,
        trim: true,
      },

      studentEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      interviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interview",
        required: true,
      },

      interviewTitle: {
        type: String,
        required: true,
      },

      questionIndex: {
        type: Number,
        required: true,
      },

      question: {
        type: String,
        required: true,
      },

      videoFilename: {
        type: String,
        required: true,
      },

      videoPath: {
        type: String,
        required: true,
      },

      videoSize: {
        type: Number,
        default: 0,
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

const Answer =
  mongoose.model(
    "Answer",
    answerSchema
  );

module.exports = Answer;

export {};