import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

function useStudentInterview({
  interviews,
  startCamera,
  stopCamera,
  setPage,
  getQuestionText,
  getQuestionTimeLimit,
  stopAiSpeaking,
  isRecording,
  stopRecording,
  recordedVideos,
  setRecordedVideos,
  setCurrentVideoUrl,
  autoSubmitRef,
}) {
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [selectedInterview, setSelectedInterview] =
    useState("");

  const [currentInterview, setCurrentInterview] =
    useState(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [timeRemaining, setTimeRemaining] =
    useState(null);

  const [timerActive, setTimerActive] =
    useState(false);

  const [timeUp, setTimeUp] = useState(false);

  const questionTimerRef = useRef(null);

  // Prevent timer from starting more than once
  // for the same question.
  const timerStartedQuestionRef = useRef(null);

  // Keep latest recording values available
  const recordedVideosRef = useRef(recordedVideos);
  const isRecordingRef = useRef(isRecording);

  useEffect(() => {
    recordedVideosRef.current = recordedVideos;
  }, [recordedVideos]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // ========================================================
  // START INTERVIEW
  // ========================================================

  async function startStudentInterview() {
    if (!studentName.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!studentEmail.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (!selectedInterview) {
      alert("Please select an assesment.");
      return;
    }

    const interview = interviews.find(
      (item) =>
        String(item.id) === String(selectedInterview)
    );

    if (!interview) {
      alert("Interview not found.");
      return;
    }

    if (
      !interview.questions ||
      interview.questions.length === 0
    ) {
      alert("This interview has no questions.");
      return;
    }

    try {
      const stream = await startCamera();

      if (!stream) {
        alert(
          "Could not access camera and microphone."
        );
        return;
      }

      setCurrentInterview(interview);
      setCurrentQuestionIndex(0);

      setRecordedVideos({});
      setCurrentVideoUrl(null);

      // Timer does NOT start here.
      setTimeRemaining(null);
      setTimerActive(false);
      setTimeUp(false);

      timerStartedQuestionRef.current = null;

      autoSubmitRef.current = false;

      setPage("interview");
    } catch (error) {
      console.error(
        "Camera start failed:",
        error
      );

      alert(
        "Please allow camera and microphone permission."
      );
    }
  }

  // ========================================================
  // START QUESTION TIMER
  // ========================================================

  const startQuestionTimer = useCallback(
    (questionIndex) => {
      if (!currentInterview) {
        return;
      }

      // Timer can only start once for this question.
      if (
        timerStartedQuestionRef.current ===
        questionIndex
      ) {
        return;
      }

      timerStartedQuestionRef.current =
        questionIndex;

      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
        questionTimerRef.current = null;
      }

      const currentQuestion =
        currentInterview.questions[
          questionIndex
        ];

      const timeLimit =
        getQuestionTimeLimit(currentQuestion);

      if (
        !timeLimit ||
        Number(timeLimit) <= 0
      ) {
        setTimeRemaining(null);
        setTimerActive(false);
        setTimeUp(false);
        return;
      }

      setTimeRemaining(Number(timeLimit));
      setTimerActive(true);
      setTimeUp(false);

      autoSubmitRef.current = false;

      questionTimerRef.current =
        setInterval(() => {
          setTimeRemaining((seconds) => {
            if (seconds <= 1) {
              clearInterval(
                questionTimerRef.current
              );

              questionTimerRef.current =
                null;

              setTimerActive(false);

              return 0;
            }

            return seconds - 1;
          });
        }, 1000);
    },
    [
      currentInterview,
      getQuestionTimeLimit,
      autoSubmitRef,
    ]
  );

  // ========================================================
  // AUTOMATIC TIME-UP HANDLER
  // ========================================================

  useEffect(() => {
    if (
      timeRemaining !== 0 ||
      !currentInterview
    ) {
      return;
    }

    // Prevent duplicate time-up handling.
    if (autoSubmitRef.current) {
      return;
    }

    autoSubmitRef.current = true;

    setTimeUp(true);

    // ======================================================
    // CASE 1:
    // STUDENT IS CURRENTLY RECORDING
    //
    // Stop recording.
    // useRecording will upload the video and then call
    // moveToNextQuestionAfterAutoSubmit().
    // ======================================================

    if (isRecordingRef.current) {
      stopRecording(true);
      return;
    }

    // ======================================================
    // CASE 2:
    // STUDENT NEVER STARTED RECORDING
    //
    // No video exists.
    // Do NOT create/upload an empty video.
    // Simply move to the next question.
    // ======================================================

    moveToNextQuestionAfterAutoSubmit(
      currentQuestionIndex
    );
  }, [
    timeRemaining,
    currentInterview,
    currentQuestionIndex,
    stopRecording,
    autoSubmitRef,
  ]);

  // ========================================================
  // AUTO NEXT QUESTION
  // ========================================================

  function moveToNextQuestionAfterAutoSubmit(
    questionIndex
  ) {
    if (!currentInterview) {
      return;
    }

    const total =
      currentInterview.questions.length;

    // ======================================================
    // MORE QUESTIONS AVAILABLE
    // ======================================================

    if (questionIndex < total - 1) {
      if (questionTimerRef.current) {
        clearInterval(
          questionTimerRef.current
        );

        questionTimerRef.current = null;
      }

      setTimerActive(false);
      setTimeRemaining(null);
      setTimeUp(false);

      // Allow timer to start for new question.
      timerStartedQuestionRef.current = null;

      autoSubmitRef.current = false;

      setCurrentQuestionIndex(
        questionIndex + 1
      );

      setCurrentVideoUrl(null);

      return;
    }

    // ======================================================
    // LAST QUESTION COMPLETED
    // ======================================================

    if (questionTimerRef.current) {
      clearInterval(
        questionTimerRef.current
      );

      questionTimerRef.current = null;
    }

    setTimerActive(false);
    setTimeRemaining(null);

    alert(
      "Interview completed! All answers have been submitted."
    );

    stopCamera();

    setCurrentInterview(null);
    setCurrentQuestionIndex(0);
    setRecordedVideos({});
    setCurrentVideoUrl(null);
    setTimeUp(false);

    timerStartedQuestionRef.current = null;

    autoSubmitRef.current = false;

    setPage("student");
  }

  // ========================================================
  // NEXT QUESTION
  // ========================================================

  function nextQuestion() {
    if (!currentInterview) {
      return;
    }

    if (isRecordingRef.current) {
      alert(
        "Please stop the recording before continuing."
      );
      return;
    }

    const latestRecordedVideos =
      recordedVideosRef.current;

    if (
      !latestRecordedVideos[
        currentQuestionIndex
      ]
    ) {
      alert(
        "Please record your answer before continuing."
      );
      return;
    }

    if (questionTimerRef.current) {
      clearInterval(
        questionTimerRef.current
      );

      questionTimerRef.current = null;
    }

    setTimerActive(false);
    setTimeRemaining(null);
    setTimeUp(false);

    // New question is allowed to start its timer.
    timerStartedQuestionRef.current = null;

    autoSubmitRef.current = false;

    const total =
      currentInterview.questions.length;

    if (currentQuestionIndex < total - 1) {
      setCurrentQuestionIndex(
        (oldIndex) => oldIndex + 1
      );

      setCurrentVideoUrl(null);

      return;
    }

    // ======================================================
    // FINISH INTERVIEW
    // ======================================================

    alert("Interview completed!");

    stopCamera();

    setCurrentInterview(null);
    setCurrentQuestionIndex(0);
    setRecordedVideos({});
    setCurrentVideoUrl(null);

    setTimeRemaining(null);
    setTimerActive(false);
    setTimeUp(false);

    timerStartedQuestionRef.current = null;

    autoSubmitRef.current = false;

    setPage("student");
  }

  // ========================================================
  // EXIT INTERVIEW
  // ========================================================

  function exitInterview() {
    stopAiSpeaking();

    if (questionTimerRef.current) {
      clearInterval(
        questionTimerRef.current
      );

      questionTimerRef.current = null;
    }

    if (isRecordingRef.current) {
      stopRecording();
    }

    stopCamera();

    setCurrentInterview(null);
    setCurrentQuestionIndex(0);
    setRecordedVideos({});
    setCurrentVideoUrl(null);

    setTimeRemaining(null);
    setTimerActive(false);
    setTimeUp(false);

    timerStartedQuestionRef.current = null;

    autoSubmitRef.current = false;

    setPage("student");
  }

  // ========================================================
  // FORMAT TIME
  // ========================================================

  function formatTime(seconds) {
    if (
      seconds === null ||
      seconds === undefined
    ) {
      return "00:00";
    }

    const safeSeconds = Math.max(
      0,
      Number(seconds)
    );

    const minutes = Math.floor(
      safeSeconds / 60
    );

    const remainingSeconds =
      safeSeconds % 60;

    return (
      String(minutes).padStart(2, "0") +
      ":" +
      String(remainingSeconds).padStart(2, "0")
    );
  }

  // ========================================================
  // CLEANUP
  // ========================================================

  useEffect(() => {
    return () => {
      if (questionTimerRef.current) {
        clearInterval(
          questionTimerRef.current
        );

        questionTimerRef.current = null;
      }
    };
  }, []);

  // ========================================================
  // RETURN
  // ========================================================

  return {
    studentName,
    setStudentName,

    studentEmail,
    setStudentEmail,

    selectedInterview,
    setSelectedInterview,

    currentInterview,
    setCurrentInterview,

    currentQuestionIndex,
    setCurrentQuestionIndex,

    timeRemaining,
    timerActive,
    timeUp,

    startStudentInterview,
    startQuestionTimer,

    moveToNextQuestionAfterAutoSubmit,
    nextQuestion,
    exitInterview,

    formatTime,
  };
}

export default useStudentInterview;