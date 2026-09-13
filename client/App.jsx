import { useEffect, useRef } from "react";

import "./src/styles/common.css";
import "./src/styles/adminPanel.css";
import "./src/styles/interviewPanel.css";

import useNavigation from "./src/hooks/useNavigation";
import useCamera from "./src/hooks/useCamera";
import useRecording from "./src/hooks/useRecording";
import useAdmin from "./src/hooks/useAdmin";
import useInterviews from "./src/hooks/useInterviews";
import useStudentInterview from "./src/hooks/useStudentInterview";
import useAiSpeech from "./src/hooks/useAiSpeech";
import useInterviewPage from "./src/hooks/useInterviewPage";
import useRecordingBridge from "./src/hooks/useRecordingBridge";

import StudentPage from "./src/components/StudentPage";
import AdminPage from "./src/components/admin/AdminPage";
import InterviewPage from "./src/components/Interview/InterviewPage";

import { API_URL } from "./src/config/api";

// ==========================================================
// PAGE HELPERS
// ==========================================================

function getQuestionText(question) {
  if (typeof question === "string") {
    return question;
  }

  return question?.text || "";
}

function getQuestionTimeLimit(question) {
  if (typeof question === "string") {
    return null;
  }

  return question?.timeLimit || null;
}

function formatFileSize(bytes) {
  if (!bytes) {
    return "0 KB";
  }

  const mb = bytes / (1024 * 1024);

  if (mb >= 1) {
    return mb.toFixed(2) + " MB";
  }

  return (bytes / 1024).toFixed(0) + " KB";
}

// ==========================================================
// APP
// ==========================================================

function App() {
  // ========================================================
  // NAVIGATION
  // ========================================================

  const { page, navigateTo } = useNavigation();

  // ========================================================
  // INTERVIEWS
  // ========================================================

  const {
    interviewTitle,
    setInterviewTitle,
    questions,
    interviews,
    setInterviews,
    loadInterviews,
    addQuestion,
    updateQuestion,
    updateQuestionTimeLimit,
    deleteQuestion,
    createInterview,
  } = useInterviews({
    API_URL,
    getQuestionText,
    getQuestionTimeLimit,
  });

  // ========================================================
  // CAMERA
  // ========================================================

  const {
    cameraStream,
    cameraVideoRef,
    startCamera,
    stopCamera: stopCameraStream,
  } = useCamera();

  // ========================================================
  // AI SPEECH
  // ========================================================

  const {
    aiSpeaking,
    aiEnabled,
    speakAiQuestion,
    stopAiSpeaking,
  } = useAiSpeech();

  // ========================================================
  // RECORDING BRIDGE
  // ========================================================

  const {
    recordingControlsRef,
    studentInterviewRef,
  } = useRecordingBridge({
    currentInterview: null,
    currentQuestionIndex: 0,
    recordingControls: {
      isRecording: false,
      stopRecording: () => {},
    },
  });

  // ========================================================
  // LIVE RECORDED VIDEOS PROXY
  // ========================================================

  const recordedVideosProxyRef = useRef(null);

  if (!recordedVideosProxyRef.current) {
    recordedVideosProxyRef.current =
      new Proxy(
        {},
        {
          get(_, property) {
            const videos =
              recordingControlsRef.current
                .recordedVideos || {};

            return videos[property];
          },

          has(_, property) {
            const videos =
              recordingControlsRef.current
                .recordedVideos || {};

            return property in videos;
          },

          ownKeys() {
            const videos =
              recordingControlsRef.current
                .recordedVideos || {};

            return Reflect.ownKeys(videos);
          },

          getOwnPropertyDescriptor(
            _,
            property
          ) {
            const videos =
              recordingControlsRef.current
                .recordedVideos || {};

            if (
              Object.prototype.hasOwnProperty.call(
                videos,
                property
              )
            ) {
              return {
                value: videos[property],
                writable: true,
                enumerable: true,
                configurable: true,
              };
            }

            return undefined;
          },
        }
      );
  }

  // ========================================================
  // STUDENT INTERVIEW
  // ========================================================

  const {
    studentName,
    setStudentName,
    studentEmail,
    setStudentEmail,
    selectedInterview,
    setSelectedInterview,

    currentInterview,
    currentQuestionIndex,

    timeRemaining,
    timeUp,

    startStudentInterview,
    startQuestionTimer,
    moveToNextQuestionAfterAutoSubmit,
    nextQuestion: studentNextQuestion,
    exitInterview: studentExitInterview,

    formatTime,
  } = useStudentInterview({
    interviews,

    startCamera,

    stopCamera: () => {
      stopAiSpeaking();
      stopCameraStream();
    },

    setPage: navigateTo,

    getQuestionText,
    getQuestionTimeLimit,

    stopAiSpeaking,

    // ------------------------------------------------------
    // Recording bridge
    // ------------------------------------------------------

    isRecording:
      recordingControlsRef.current
        .isRecording,

    stopRecording: (...args) => {
      recordingControlsRef.current.stopRecording(
        ...args
      );
    },

    // ------------------------------------------------------
    // Live recording data
    // ------------------------------------------------------

    recordedVideos:
      recordedVideosProxyRef.current,

    setRecordedVideos: (value) => {
      if (
        recordingControlsRef.current
          .setRecordedVideos
      ) {
        recordingControlsRef.current.setRecordedVideos(
          value
        );
      }
    },

    setCurrentVideoUrl: (value) => {
      if (
        recordingControlsRef.current
          .setCurrentVideoUrl
      ) {
        recordingControlsRef.current.setCurrentVideoUrl(
          value
        );
      }
    },

    autoSubmitRef:
      recordingControlsRef.current
        .autoSubmitRef ||
      {
        current: false,
      },
  });

  // ========================================================
  // RECORDING
  // ========================================================

  const {
    isRecording,
    recordingSeconds,
    recordedVideos,
    setRecordedVideos,
    setCurrentVideoUrl,
    startRecording,
    stopRecording,
    autoSubmitRef,
  } = useRecording({
    cameraStream,

    currentInterview,

    currentQuestionIndex,

    studentName,

    studentEmail,

    API_URL,

    getQuestionText,

    stopAiSpeaking,

    onAutomaticSubmit:
      moveToNextQuestionAfterAutoSubmit,

    onUploadSuccess: () => {
      if (page === "admin") {
        loadAnswers();
      }
    },
  });

  // ========================================================
  // UPDATE RECORDING BRIDGE
  // ========================================================

  recordingControlsRef.current = {
    isRecording,
    stopRecording,
    recordedVideos,
    setRecordedVideos,
    setCurrentVideoUrl,
    autoSubmitRef,
  };

  // ========================================================
  // UPDATE STUDENT INTERVIEW REF
  // ========================================================

  studentInterviewRef.current = {
    currentInterview,
    currentQuestionIndex,
  };

  // ========================================================
  // INTERVIEW PAGE LOGIC
  // ========================================================

  const {
    questionText,
    questionTimeLimit,
    total,
    answerRecorded,
    progressPercent,
    nextQuestion,
    exitInterview,
  } = useInterviewPage({
    currentInterview,
    currentQuestionIndex,
    isRecording,
    recordedVideos,
    studentNextQuestion,
    studentExitInterview,
    getQuestionText,
    getQuestionTimeLimit,
  });

  // ========================================================
  // ADMIN
  // ========================================================

  const {
    adminEmail,
    setAdminEmail,
    adminPassword,
    setAdminPassword,
    adminError,
    adminLoading,
    isAdminLoggedIn,
    answers,
    loadingAnswers,
    selectedSubmission,
    setSelectedSubmission,
    selectedAnswer,
    adminVideoUrl,
    loadingAdminVideo,
    adminLogin,
    adminLogout,
    loadAnswers,
    openAnswerVideo,
    closeAnswerVideo,
    getGroupedSubmissions,
    downloadAnswer,
    deleteAnswer,
    deleteFullInterview,
    deleteAssessment,
    downloadFullInterview,
  } = useAdmin({
    API_URL,
    navigateTo,
    setInterviews,
    loadInterviews,
  });

  // ========================================================
  // INITIAL DATA
  // ========================================================

  useEffect(() => {
    loadInterviews();

    if (
      page === "admin" &&
      isAdminLoggedIn
    ) {
      loadAnswers();
    }
  }, [
    page,
    isAdminLoggedIn,
  ]);

  // ========================================================
  // AI QUESTION SPEECH
  // ========================================================

  useEffect(() => {
    if (
      page !== "interview" ||
      !currentInterview
    ) {
      return;
    }

    const currentQuestion =
      currentInterview.questions[
        currentQuestionIndex
      ];

    const currentQuestionText =
      getQuestionText(currentQuestion);

    if (!currentQuestionText) {
      return;
    }

    console.log(
      "🎯 Starting AI question:",
      currentQuestionText
    );

    // ------------------------------------------------------
    // Small delay so interview UI renders first
    // ------------------------------------------------------

    const timeoutId = setTimeout(() => {
      console.log(
        "🎤 Speaking AI question:",
        currentQuestionText
      );

      speakAiQuestion(
        currentQuestionText,
        () => {
          console.log(
            "✅ AI finished speaking. Starting timer."
          );

          startQuestionTimer(
            currentQuestionIndex
          );
        }
      );
    }, 500);

    // ------------------------------------------------------
    // IMPORTANT:
    // Only clear the pending timeout here.
    //
    // Do NOT call stopAiSpeaking() from cleanup because
    // React can run this cleanup when the component/effect
    // re-runs, which can cancel the AI speech.
    // ------------------------------------------------------

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    page,
    currentInterview,
    currentQuestionIndex,
  ]);

  // ========================================================
  // ADMIN PAGE
  // ========================================================

  if (page === "admin") {
    return (
      <AdminPage
        isAdminLoggedIn={
          isAdminLoggedIn
        }

        adminEmail={adminEmail}
        setAdminEmail={
          setAdminEmail
        }

        adminPassword={
          adminPassword
        }

        setAdminPassword={
          setAdminPassword
        }

        adminError={adminError}

        adminLoading={
          adminLoading
        }

        adminLogin={adminLogin}

        adminLogout={adminLogout}

        interviews={interviews}

        answers={answers}

        getGroupedSubmissions={
          getGroupedSubmissions
        }

        interviewTitle={
          interviewTitle
        }

        setInterviewTitle={
          setInterviewTitle
        }

        questions={questions}

        addQuestion={
          addQuestion
        }

        updateQuestion={
          updateQuestion
        }

        updateQuestionTimeLimit={
          updateQuestionTimeLimit
        }

        deleteQuestion={
          deleteQuestion
        }

        createInterview={
          createInterview
        }

        loadInterviews={
          loadInterviews
        }

        loadAnswers={
          loadAnswers
        }

        loadingAnswers={
          loadingAnswers
        }

        deleteAssessment={
          deleteAssessment
        }

        getQuestionText={
          getQuestionText
        }

        getQuestionTimeLimit={
          getQuestionTimeLimit
        }

        selectedSubmission={
          selectedSubmission
        }

        setSelectedSubmission={
          setSelectedSubmission
        }

        openAnswerVideo={
          openAnswerVideo
        }

        downloadAnswer={
          downloadAnswer
        }

        deleteAnswer={
          deleteAnswer
        }

        downloadFullInterview={
          downloadFullInterview
        }

        selectedAnswer={
          selectedAnswer
        }

        closeAnswerVideo={
          closeAnswerVideo
        }

        loadingAdminVideo={
          loadingAdminVideo
        }

        adminVideoUrl={
          adminVideoUrl
        }

        formatFileSize={
          formatFileSize
        }

        deleteFullInterview={
          deleteFullInterview
        }
      />
    );
  }

  // ========================================================
  // STUDENT PAGE
  // ========================================================

  if (page === "student") {
    return (
      <StudentPage
        studentName={
          studentName
        }

        setStudentName={
          setStudentName
        }

        studentEmail={
          studentEmail
        }

        setStudentEmail={
          setStudentEmail
        }

        selectedInterview={
          selectedInterview
        }

        setSelectedInterview={
          setSelectedInterview
        }

        interviews={
          interviews
        }

        startStudentInterview={
          startStudentInterview
        }

        setPage={navigateTo}
      />
    );
  }

  // ========================================================
  // INTERVIEW PAGE
  // ========================================================

  if (page === "interview") {
    if (!currentInterview) {
      return (
        <StudentPage
          studentName={
            studentName
          }

          setStudentName={
            setStudentName
          }

          studentEmail={
            studentEmail
          }

          setStudentEmail={
            setStudentEmail
          }

          selectedInterview={
            selectedInterview
          }

          setSelectedInterview={
            setSelectedInterview
          }

          interviews={
            interviews
          }

          startStudentInterview={
            startStudentInterview
          }

          setPage={navigateTo}
        />
      );
    }

    const timerIsDanger =
      timeRemaining !== null &&
      timeRemaining <= 10;

    return (
      <InterviewPage
        currentInterview={
          currentInterview
        }

        currentQuestionIndex={
          currentQuestionIndex
        }

        studentName={
          studentName
        }

        aiSpeaking={
          aiSpeaking
        }

        questionText={
          questionText
        }

        questionTimeLimit={
          questionTimeLimit
        }

        timeUp={
          timeUp
        }

        timeRemaining={
          timeRemaining
        }

        timerIsDanger={
          timerIsDanger
        }

        cameraStream={
          cameraStream
        }

        cameraVideoRef={
          cameraVideoRef
        }

        isRecording={
          isRecording
        }

        recordingSeconds={
          recordingSeconds
        }

        answerRecorded={
          answerRecorded
        }

        total={total}

        progressPercent={
          progressPercent
        }

        stopAiSpeaking={
          stopAiSpeaking
        }

        speakAiQuestion={
          speakAiQuestion
        }

        formatTime={
          formatTime
        }

        startRecording={
          startRecording
        }

        stopRecording={
          stopRecording
        }

        nextQuestion={
          nextQuestion
        }

        exitInterview={
          exitInterview
        }
      />
    );
  }

  return null;
}

export default App;