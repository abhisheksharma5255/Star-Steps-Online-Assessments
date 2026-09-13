import { useEffect, useRef, useState } from "react";

function useRecording({
  cameraStream,
  currentInterview,
  currentQuestionIndex,
  studentName,
  studentEmail,
  API_URL,
  getQuestionText,
  stopAiSpeaking,
  onAutomaticSubmit,
  onUploadSuccess,
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] =
    useState(0);

  const [recordedVideos, setRecordedVideos] =
    useState({});

  const [currentVideoUrl, setCurrentVideoUrl] =
    useState(null);

  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const timerRef = useRef(null);
  const autoSubmitRef = useRef(false);

  // =========================
  // RECORDING TIMER
  // =========================

  useEffect(() => {
    clearInterval(timerRef.current);

    if (!isRecording) {
      return;
    }

    timerRef.current = setInterval(() => {
      setRecordingSeconds(
        (seconds) => seconds + 1
      );
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // =========================
  // START RECORDING
  // =========================

  function startRecording() {
    if (!cameraStream) {
      alert("Camera is not available.");
      return;
    }

    if (!currentInterview) {
      return;
    }

    stopAiSpeaking();

    recordedChunksRef.current = [];

    let options = {};

    if (
      MediaRecorder.isTypeSupported(
        "video/webm;codecs=vp9,opus"
      )
    ) {
      options = {
        mimeType:
          "video/webm;codecs=vp9,opus",
      };
    } else if (
      MediaRecorder.isTypeSupported(
        "video/webm"
      )
    ) {
      options = {
        mimeType: "video/webm",
      };
    }

    const recorder = new MediaRecorder(
      cameraStream,
      options
    );

    const questionIndexAtStart =
      currentQuestionIndex;

    recorder.ondataavailable = (event) => {
      if (
        event.data &&
        event.data.size > 0
      ) {
        recordedChunksRef.current.push(
          event.data
        );
      }
    };

    recorder.onstop = async () => {
      const blob = new Blob(
        recordedChunksRef.current,
        {
          type:
            recorder.mimeType ||
            "video/webm",
        }
      );

      const videoUrl =
        URL.createObjectURL(blob);

      setRecordedVideos((oldVideos) => ({
        ...oldVideos,
        [questionIndexAtStart]: blob,
      }));

      setCurrentVideoUrl(videoUrl);

      const wasAutomatic =
        autoSubmitRef.current;

      await uploadAnswerVideo(
        blob,
        questionIndexAtStart,
        wasAutomatic
      );
    };

    mediaRecorderRef.current = recorder;

    autoSubmitRef.current = false;

    setRecordingSeconds(0);

    setCurrentVideoUrl(null);

    recorder.start();

    setIsRecording(true);
  }

  // =========================
  // UPLOAD ANSWER VIDEO
  // =========================

  async function uploadAnswerVideo(
    blob,
    questionIndex,
    automaticSubmit = false
  ) {
    if (!currentInterview) {
      return;
    }

    const question =
      currentInterview.questions[
        questionIndex
      ];

    const questionText =
      getQuestionText(question);

    try {
      const formData = new FormData();

      formData.append(
        "video",
        blob,
        "answer.webm"
      );

      formData.append(
        "studentName",
        studentName
      );

      formData.append(
        "studentEmail",
        studentEmail
      );

      formData.append(
        "interviewId",
        currentInterview.id
      );

      formData.append(
        "interviewTitle",
        currentInterview.title
      );

      formData.append(
        "questionIndex",
        String(questionIndex + 1)
      );

      formData.append(
        "question",
        questionText
      );

      const response = await fetch(
        API_URL +
          "/api/interviews/upload-answer",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Upload failed"
        );
      }

      console.log(
        "Answer uploaded:",
        data
      );

      if (onUploadSuccess) {
        onUploadSuccess();
      }

      if (automaticSubmit) {
        await onAutomaticSubmit(
          questionIndex
        );
      }
    } catch (error) {
      console.error(
        "Answer upload failed:",
        error
      );

      alert(
        "Video was recorded, but upload failed."
      );
    }
  }

  // =========================
  // STOP RECORDING
  // =========================

  function stopRecording(automatic = false) {
    clearInterval(timerRef.current);

    setIsRecording(false);

    if (automatic) {
      // The parent question timer will
      // handle the time-up state.
    } else {
      autoSubmitRef.current = false;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !==
        "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  }

  // =========================
  // CLEANUP
  // =========================

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);

      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !==
          "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return {
    isRecording,
    recordingSeconds,
    recordedVideos,
    setRecordedVideos,
    currentVideoUrl,
    setCurrentVideoUrl,
    startRecording,
    stopRecording,
    autoSubmitRef,
  };
}

export default useRecording;