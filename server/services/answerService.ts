const Answer = require("../models/Answer");
const Interview = require("../models/Interview");

async function createAnswer(data: any) {
  return await Answer.create(data);
}

async function findAllAnswers() {
  return await Answer.find().sort({
    studentEmail: 1,
    questionIndex: 1,
    createdAt: 1,
  });
}

async function findAnswerById(answerId: any) {
  return await Answer.findById(answerId);
}

async function findInterviewById(interviewId: any) {
  return await Interview.findById(
    interviewId
  );
}

async function deleteAnswerById(answerId: any) {
  return await Answer.findByIdAndDelete(
    answerId
  );
}

module.exports = {
  createAnswer,
  findAllAnswers,
  findAnswerById,
  findInterviewById,
  deleteAnswerById,
};

export {};