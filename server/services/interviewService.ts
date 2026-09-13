const Interview = require("../models/Interview");
const Answer = require("../models/Answer");

async function findAllInterviews() {
  return await Interview.find().sort({
    createdAt: -1,
  });
}

async function createInterview(data: any) {
  return await Interview.create(data);
}

async function findInterviewById(interviewId: any) {
  return await Interview.findById(
    interviewId
  );
}

async function findInterviewAnswers(
  interviewId: any
) {
  return await Answer.find({
    interviewId,
  });
}

async function deleteInterviewAnswers(
  interviewId: any
) {
  return await Answer.deleteMany({
    interviewId,
  });
}

async function deleteInterviewById(
  interviewId: any
) {
  return await Interview.findByIdAndDelete(
    interviewId
  );
}

module.exports = {
  findAllInterviews,
  createInterview,
  findInterviewById,
  findInterviewAnswers,
  deleteInterviewAnswers,
  deleteInterviewById,
};

export {};