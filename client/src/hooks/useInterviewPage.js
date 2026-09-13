import { useCallback } from "react";

export default function useInterviewPage({
  currentInterview,
  currentQuestionIndex,
  isRecording,
  recordedVideos,
  studentNextQuestion,
  studentExitInterview,
  getQuestionText,
  getQuestionTimeLimit,
}) {
  // ========================================================
  // CURRENT QUESTION
  // ========================================================

  const question =
    currentInterview?.questions?.[
      currentQuestionIndex
    ] || null;

  // ========================================================
  // QUESTION DATA
  // ========================================================

  const questionText =
    getQuestionText(question);

  const questionTimeLimit =
    getQuestionTimeLimit(question);

  // ========================================================
  // TOTAL QUESTIONS
  // ========================================================

  const total =
    currentInterview?.questions?.length || 0;

  // ========================================================
  // ANSWER STATUS
  // ========================================================

  const answerRecorded =
    !!recordedVideos[
      currentQuestionIndex
    ];

  // ========================================================
  // PROGRESS
  // ========================================================

  const progressPercent =
    total > 0
      ? ((currentQuestionIndex + 1) /
          total) *
        100
      : 0;

  // ========================================================
  // NEXT QUESTION
  // ========================================================

  const nextQuestion = useCallback(() => {
    if (!currentInterview) {
      return;
    }

    if (isRecording) {
      alert(
        "Please stop the recording before continuing."
      );

      return;
    }

    if (
      !recordedVideos[
        currentQuestionIndex
      ]
    ) {
      alert(
        "Please record your answer before continuing."
      );

      return;
    }

    studentNextQuestion();
  }, [
    currentInterview,
    isRecording,
    recordedVideos,
    currentQuestionIndex,
    studentNextQuestion,
  ]);

  // ========================================================
  // EXIT INTERVIEW
  // ========================================================

  const exitInterview = useCallback(() => {
    studentExitInterview();
  }, [
    studentExitInterview,
  ]);

  // ========================================================
  // RETURN
  // ========================================================

  return {
    question,
    questionText,
    questionTimeLimit,
    total,
    answerRecorded,
    progressPercent,
    nextQuestion,
    exitInterview,
  };
}