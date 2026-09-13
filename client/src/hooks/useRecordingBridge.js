import { useEffect, useRef } from "react";

export default function useRecordingBridge({
  currentInterview,
  currentQuestionIndex,
  recordingControls,
}) {
  // ========================================================
  // RECORDING CONTROLS REF
  // ========================================================

  const recordingControlsRef = useRef({
    isRecording: false,
    stopRecording: () => {},
  });

  // ========================================================
  // STUDENT INTERVIEW REF
  // ========================================================

  const studentInterviewRef = useRef({
    currentInterview: null,
    currentQuestionIndex: 0,
  });

  // ========================================================
  // UPDATE RECORDING CONTROLS
  // ========================================================

  recordingControlsRef.current =
    recordingControls;

  // ========================================================
  // KEEP STUDENT INTERVIEW REF UPDATED
  // ========================================================

  useEffect(() => {
    studentInterviewRef.current = {
      currentInterview,
      currentQuestionIndex,
    };
  }, [
    currentInterview,
    currentQuestionIndex,
  ]);

  // ========================================================
  // RETURN
  // ========================================================

  return {
    recordingControlsRef,
    studentInterviewRef,
  };
}