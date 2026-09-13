const {
  uploadToR2,
  getFromR2,
  deleteFromR2,
} = require("../services/r2Service");

const {
  createAnswer,
  findAllAnswers,
  findAnswerById,
  findInterviewById,
  deleteAnswerById,
} = require("../services/answerService");

/*
=====================================================
GENERATE R2 OBJECT KEY
=====================================================
*/

function createR2Key({
  studentName,
  interviewId,
  questionIndex,
  originalName,
}: {
  studentName: any;
  interviewId: any;
  questionIndex: any;
  originalName: any;
}) {
  const safeStudentName = String(
    studentName || "student"
  )
    .trim()
    .replace(/[^a-zA-Z0-9]/g, "_");

  const safeInterviewId = String(
    interviewId || "interview"
  );

  const safeQuestionIndex = String(
    questionIndex ?? "question"
  );

  const extension =
    originalName &&
    originalName.includes(".")
      ? originalName.substring(
          originalName.lastIndexOf(".")
        )
      : ".webm";

  return (
    "students/" +
    safeStudentName +
    "/" +
    safeInterviewId +
    "/q" +
    safeQuestionIndex +
    "_" +
    Date.now() +
    extension
  );
}

/*
=====================================================
STUDENT ANSWER UPLOAD
=====================================================
*/

async function uploadAnswer(
  req: any,
  res: any
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Video file is required",
      });
    }

    const {
      studentName,
      studentEmail,
      interviewId,
      interviewTitle,
      questionIndex,
      question,
    } = req.body;

    /*
    =================================================
    VALIDATION
    =================================================
    */

    if (
      !studentName ||
      !studentEmail ||
      !interviewId ||
      !interviewTitle ||
      questionIndex === undefined ||
      questionIndex === null ||
      !question
    ) {
      return res.status(400).json({
        message:
          "Student and interview details are required",
      });
    }

    /*
    =================================================
    CHECK INTERVIEW
    =================================================
    */

    const interview =
      await findInterviewById(
        interviewId
      );

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    /*
    =================================================
    CREATE R2 OBJECT KEY
    =================================================
    */

    const r2Key = createR2Key({
      studentName,
      interviewId,
      questionIndex,
      originalName:
        req.file.originalname,
    });

    /*
    =================================================
    UPLOAD VIDEO TO CLOUDFLARE R2
    =================================================
    */

    await uploadToR2({
      key: r2Key,

      body: req.file.buffer,

      contentType:
        req.file.mimetype ||
        "video/webm",

      contentLength:
        req.file.size,
    });

    /*
    =================================================
    SAVE ANSWER IN MONGODB
    =================================================
    */

    let answer;

    try {
      answer = await createAnswer({
        studentName:
          String(studentName).trim(),

        studentEmail:
          String(studentEmail)
            .toLowerCase()
            .trim(),

        interviewId,

        interviewTitle:
          String(interviewTitle).trim(),

        questionIndex:
          Number(questionIndex),

        question:
          String(question).trim(),

        videoFilename:
          req.file.originalname ||
          r2Key.split("/").pop(),

        /*
        videoPath now stores
        the R2 object key
        */

        videoPath: r2Key,

        videoSize:
          req.file.size || 0,
      });
    } catch (databaseError) {
      /*
      ===============================================
      IF MONGODB SAVE FAILS,
      DELETE VIDEO FROM R2
      ===============================================
      */

      try {
        await deleteFromR2(
          r2Key
        );
      } catch (deleteError) {
        console.error(
          "Failed to rollback R2 upload:",
          deleteError
        );
      }

      throw databaseError;
    }

    /*
    =================================================
    RESPONSE
    =================================================
    */

    res.status(201).json({
      message:
        "Answer video uploaded and saved successfully",

      answer: {
        id: answer._id,

        studentName:
          answer.studentName,

        studentEmail:
          answer.studentEmail,

        interviewId:
          answer.interviewId,

        interviewTitle:
          answer.interviewTitle,

        questionIndex:
          answer.questionIndex,

        question:
          answer.question,

        videoFilename:
          answer.videoFilename,

        videoSize:
          answer.videoSize,

        createdAt:
          answer.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "❌ Answer upload failed:",
      error
    );

    res.status(500).json({
      message:
        "Failed to save answer",
    });
  }
}

/*
=====================================================
GET ALL ANSWERS
=====================================================
*/

async function getAllAnswers(
  req: any,
  res: any
) {
  try {
    const answers =
      await findAllAnswers();

    res.json(answers);
  } catch (error) {
    console.error(
      "❌ Failed to fetch answers:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch answers",
    });
  }
}

/*
=====================================================
GET SINGLE ANSWER
=====================================================
*/

async function getAnswerById(
  req: any,
  res: any
) {
  try {
    const answer =
      await findAnswerById(
        req.params.id
      );

    if (!answer) {
      return res.status(404).json({
        message:
          "Answer not found",
      });
    }

    res.json(answer);
  } catch (error) {
    console.error(
      "❌ Failed to fetch answer:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch answer",
    });
  }
}

/*
=====================================================
VIDEO PREVIEW
=====================================================
*/

async function previewAnswerVideo(
  req: any,
  res: any
) {
  try {
    const answer =
      await findAnswerById(
        req.params.id
      );

    if (!answer) {
      return res.status(404).json({
        message:
          "Answer not found",
      });
    }

    if (!answer.videoPath) {
      return res.status(404).json({
        message:
          "Video file not found",
      });
    }

    const video =
      await getFromR2(
        answer.videoPath
      );

    if (!video.Body) {
      return res.status(404).json({
        message:
          "Video file not found",
      });
    }

    res.setHeader(
      "Content-Type",
      video.ContentType ||
        "video/webm"
    );

    res.setHeader(
      "Content-Disposition",
      "inline"
    );

    if (video.ContentLength) {
      res.setHeader(
        "Content-Length",
        video.ContentLength
      );
    }

    if (video.AcceptRanges) {
      res.setHeader(
        "Accept-Ranges",
        video.AcceptRanges
      );
    }

    video.Body.pipe(res);
  } catch (error) {
    console.error(
      "❌ Video preview failed:",
      error
    );

    if (!res.headersSent) {
      res.status(404).json({
        message:
          "Video file not found",
      });
    }
  }
}

/*
=====================================================
VIDEO DOWNLOAD
=====================================================
*/

async function downloadAnswerVideo(
  req: any,
  res: any
) {
  try {
    const answer =
      await findAnswerById(
        req.params.id
      );

    if (!answer) {
      return res.status(404).json({
        message:
          "Answer not found",
      });
    }

    if (!answer.videoPath) {
      return res.status(404).json({
        message:
          "Video file not found",
      });
    }

    const video =
      await getFromR2(
        answer.videoPath
      );

    if (!video.Body) {
      return res.status(404).json({
        message:
          "Video file not found",
      });
    }

    const safeName =
      answer.videoFilename ||
      "answer-" +
        String(answer._id) +
        ".webm";

    res.setHeader(
      "Content-Type",
      video.ContentType ||
        "video/webm"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeName}"`
    );

    if (video.ContentLength) {
      res.setHeader(
        "Content-Length",
        video.ContentLength
      );
    }

    video.Body.pipe(res);
  } catch (error) {
    console.error(
      "❌ Download failed:",
      error
    );

    if (!res.headersSent) {
      res.status(404).json({
        message:
          "Video file not found",
      });
    }
  }
}

/*
=====================================================
DELETE ANSWER + R2 VIDEO
=====================================================
*/

async function deleteAnswer(
  req: any,
  res: any
) {
  try {
    const answer =
      await findAnswerById(
        req.params.id
      );

    if (!answer) {
      return res.status(404).json({
        message:
          "Answer not found",
      });
    }

    /*
    =================================================
    DELETE VIDEO FROM R2
    =================================================
    */

    if (answer.videoPath) {
      try {
        await deleteFromR2(
          answer.videoPath
        );
      } catch (r2Error) {
        console.error(
          "❌ Failed to delete R2 video:",
          r2Error
        );
      }
    }

    /*
    =================================================
    DELETE MONGODB ANSWER
    =================================================
    */

    await deleteAnswerById(
      req.params.id
    );

    res.json({
      success: true,

      message:
        "Answer and video deleted successfully",
    });
  } catch (error) {
    console.error(
      "❌ Delete answer failed:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to delete answer",
    });
  }
}

module.exports = {
  uploadAnswer,
  getAllAnswers,
  getAnswerById,
  previewAnswerVideo,
  downloadAnswerVideo,
  deleteAnswer,
};

export {};