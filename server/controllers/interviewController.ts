const fs = require("fs");

const {
  findAllInterviews,
  createInterview: createInterviewService,
  findInterviewById,
  findInterviewAnswers,
  deleteInterviewAnswers,
  deleteInterviewById,
} = require("../services/interviewService");

async function getAllInterviews(
  req: any,
  res: any
) {
  try {
    const interviews =
      await findAllInterviews();

    res.json(interviews);
  } catch (error) {
    console.error(
      "❌ Failed to fetch interviews:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch interviews",
    });
  }
}

async function createInterview(
  req: any,
  res: any
) {
  try {
    const {
      title,
      questions,
    } = req.body;

    if (
      !title ||
      !String(title).trim()
    ) {
      return res.status(400).json({
        message:
          "Interview title is required",
      });
    }

    if (
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res.status(400).json({
        message:
          "At least one question is required",
      });
    }

    const formattedQuestions =
      questions
        .map((question: any) => {
          if (
            typeof question ===
            "string"
          ) {
            return {
              text:
                question.trim(),
              timeLimit:
                null,
            };
          }

          const questionText =
            String(
              question.text || ""
            ).trim();

          let timeLimit = null;

          if (
            question.timeLimit !==
              null &&
            question.timeLimit !==
              undefined &&
            question.timeLimit !==
              ""
          ) {
            timeLimit =
              Number(
                question.timeLimit
              );
          }

          return {
            text:
              questionText,
            timeLimit,
          };
        })
        .filter(
          (question: any) =>
            question.text
        );

    if (
      formattedQuestions.length ===
      0
    ) {
      return res.status(400).json({
        message:
          "At least one valid question is required",
      });
    }

    for (
      const question of
        formattedQuestions
    ) {
      if (
        question.timeLimit !==
          null &&
        (
          !Number.isFinite(
            question.timeLimit
          ) ||
          question.timeLimit <= 0
        )
      ) {
        return res.status(400).json({
          message:
            "Question time limit must be greater than 0 seconds",
        });
      }
    }

    const interview =
      await createInterviewService({
        title:
          String(title).trim(),

        questions:
          formattedQuestions,
      });

    res.status(201).json(
      interview
    );
  } catch (error) {
    console.error(
      "❌ Failed to create interview:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create interview",
    });
  }
}

async function getInterviewById(
  req: any,
  res: any
) {
  try {
    const interview =
      await findInterviewById(
        req.params.id
      );

    if (!interview) {
      return res.status(404).json({
        message:
          "Interview not found",
      });
    }

    res.json(interview);
  } catch (error) {
    console.error(
      "❌ Failed to fetch interview:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch interview",
    });
  }
}

async function deleteInterview(
  req: any,
  res: any
) {
  try {
    const interviewId =
      req.params.id;

    const interview =
      await findInterviewById(
        interviewId
      );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message:
          "Interview not found",
      });
    }

    const answers =
      await findInterviewAnswers(
        interviewId
      );

    let deletedVideos = 0;
    let missingVideos = 0;
    let failedVideos = 0;

    for (
      const answer of answers
    ) {
      if (answer.videoPath) {
        if (
          fs.existsSync(
            answer.videoPath
          )
        ) {
          try {
            fs.unlinkSync(
              answer.videoPath
            );

            deletedVideos++;
          } catch (
            fileError
          ) {
            failedVideos++;

            console.error(
              "❌ Failed to delete video:",
              answer.videoPath,
              fileError
            );
          }
        } else {
          missingVideos++;
        }
      }
    }

    const answerDeleteResult =
      await deleteInterviewAnswers(
        interviewId
      );

    await deleteInterviewById(
      interviewId
    );

    res.json({
      success: true,

      message:
        "Assessment deleted successfully",

      deletedAssessment:
        true,

      assessmentId:
        interviewId,

      deletedAnswers:
        answerDeleteResult.deletedCount ||
        0,

      deletedVideos:
        deletedVideos,

      missingVideos:
        missingVideos,

      failedVideos:
        failedVideos,
    });
  } catch (error) {
    console.error(
      "❌ Assessment delete failed:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to delete assessment",
    });
  }
}

module.exports = {
  getAllInterviews,
  createInterview,
  getInterviewById,
  deleteInterview,
};

export {};