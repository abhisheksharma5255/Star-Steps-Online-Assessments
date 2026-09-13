function InterviewPage({
  currentInterview,
  currentQuestionIndex,
  studentName,
  aiSpeaking,
  questionText,
  questionTimeLimit,
  timeUp,
  timeRemaining,
  timerIsDanger,
  cameraStream,
  cameraVideoRef,
  isRecording,
  recordingSeconds,
  answerRecorded,
  total,
  progressPercent,
  stopAiSpeaking,
  speakAiQuestion,
  formatTime,
  startRecording,
  stopRecording,
  nextQuestion,
  exitInterview,
}) {
  return (
    <div className="interviewPage">
      <div className="interviewContainer">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="interviewHeader">
          <div className="interviewBrand">
            <div>
              <h1>STAR STEPS</h1>

              <span>
                AI Interview Assessment
              </span>
            </div>
          </div>

          <div className="interviewStatus">
            Interview in progress
          </div>
        </header>

        {/* =================================================
            STUDENT + PROGRESS
        ================================================= */}

        <div className="studentInfo">
          <h2>
            Welcome, {studentName}
          </h2>

          <p>
            {currentInterview.title}
          </p>
        </div>

        <div className="questionProgress">
          <div className="questionProgressTop">
            <span>
              Question {currentQuestionIndex + 1} / {total}
            </span>

            <span>
              {Math.round(progressPercent)}%
            </span>
          </div>

          <div className="questionProgressBar">
            <div
              className="questionProgressFill"
              style={{
                width: `${progressPercent}%`,
              }}
            />
          </div>
        </div>

        {/* =================================================
            MAIN INTERVIEW AREA
        ================================================= */}

        <div className="interviewMainGrid">

          {/* =================================================
              LEFT / TOP SECTION
          ================================================= */}

          <div className="interviewLeftColumn">

            {/* =================================================
                AGENT DIVA CARD
            ================================================= */}

            <section className="aiInterviewerCard">

              <div className="aiInterviewerHeader">

                <div className="aiInterviewerTitle">

                  <div
                    className={`aiAvatar ${
                      aiSpeaking
                        ? "aiAvatarSpeaking"
                        : ""
                    }`}
                  >
                    Di
                  </div>

                  <div>
                    <h2>
                      Agent Diva
                    </h2>

                    <span>
                      AI Interviewer
                    </span>
                  </div>

                </div>

                <div className="aiStatus">
                  {aiSpeaking
                    ? "Speaking"
                    : "Active"}
                </div>

              </div>

              {/* AI SPEAKING AREA */}

              <div
                className={`aiSpeakingArea ${
                  aiSpeaking
                    ? "speaking"
                    : ""
                }`}
              >

                <div className="aiSpeakingText">
                  {aiSpeaking
                    ? "Agent Diva is asking the question..."
                    : "Click the button below to hear the question again."}
                </div>

                {aiSpeaking && (
                  <div className="aiWaveContainer">
                    <span className="aiWave" />
                    <span className="aiWave" />
                    <span className="aiWave" />
                    <span className="aiWave" />
                    <span className="aiWave" />
                  </div>
                )}

              </div>

              {/* ASK QUESTION */}

              <button
                type="button"
                className="askQuestionAgain"
                onClick={() =>
                  aiSpeaking
                    ? stopAiSpeaking()
                    : speakAiQuestion(
                        questionText
                      )
                }
              >
                {aiSpeaking
                  ? "■ Stop AI Voice"
                  : "🔊 Ask Question Again"}
              </button>

            </section>

            {/* =================================================
                QUESTION CARD
            ================================================= */}

            <section className="questionCard">

              <div className="questionCardTop">

                <span className="questionNumber">
                  QUESTION{" "}
                  {String(
                    currentQuestionIndex + 1
                  ).padStart(2, "0")}
                </span>

                {questionTimeLimit && (
                  <span className="timeBadge">
                    ⏱ {questionTimeLimit} sec
                  </span>
                )}

              </div>

              <div className="questionBox">
                <h3>
                  {questionText}
                </h3>
              </div>

              <div className="recordNotice">
                <span className="recordNoticeIcon">
                  🎥
                </span>

                <span>
                  Your response will be
                  recorded on camera.
                </span>
              </div>

              {/* QUESTION TIMER */}

              {questionTimeLimit && (
                <div
                  className={`questionTimer ${
                    timerIsDanger
                      ? "danger"
                      : ""
                  }`}
                >
                  {timeUp ? (
                    <div className="timerContent">
                      <span className="timerIcon">
                        ⏰
                      </span>

                      <div>
                        <strong>
                          Time's up!
                        </strong>

                        <p>
                          Your answer has
                          been submitted
                          automatically.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="timerContent">
                      <span className="timerIcon">
                        ⏱
                      </span>

                      <div>
                        <strong>
                          {formatTime(
                            timeRemaining
                          )}
                        </strong>

                        <p>
                          Time remaining
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </section>

          </div>

          {/* =================================================
              CAMERA SECTION
          ================================================= */}

          <section className="cameraCard">

            <div className="cameraCardHeader">

              <div>
                <div className="cameraEyebrow">
                  YOUR CAMERA
                </div>

                <h2>
                  Live Preview
                </h2>

                <p>
                  Make sure your face is
                  clearly visible.
                </p>
              </div>

              <div
                className={`cameraReady ${
                  isRecording
                    ? "recordingBadge"
                    : ""
                }`}
              >
                {isRecording
                  ? "Recording"
                  : "Ready"}
              </div>

            </div>

            {/* CAMERA */}

            <div className="cameraPreviewWrapper">

              {cameraStream ? (
                <video
                  ref={cameraVideoRef}
                  className="cameraPreview"
                  autoPlay
                  playsInline
                  muted
                />
              ) : (
                <div className="emptyState">
                  <div className="emptyIcon">
                    📷
                  </div>

                  <strong>
                    Camera not available
                  </strong>

                  <p>
                    Please allow camera
                    permission and refresh.
                  </p>
                </div>
              )}

              {isRecording && (
                <div className="cameraOverlay recordingOverlay">
                  <span />
                  Recording
                </div>
              )}

            </div>

            {/* RECORDING SECTION */}

            <div
              className={`recordingSection ${
                isRecording
                  ? "recordingActive"
                  : ""
              }`}
            >

              <div className="recordingHeader">

                <div>
                  <div className="recordingEyebrow">
                    RECORDING
                  </div>

                  <h3>
                    {isRecording
                      ? "Recording your answer"
                      : "Record your answer"}
                  </h3>
                </div>

                {isRecording && (
                  <div className="recordingTimer">
                    {formatTime(
                      recordingSeconds
                    )}
                  </div>
                )}

              </div>

              <p>
                {isRecording
                  ? "Stop when you are done answering."
                  : "Press start to begin recording your response."}
              </p>

            </div>

            {/* START */}

            {!isRecording &&
              !answerRecorded && (
                <button
                  type="button"
                  className="startAnswerButton"
                  onClick={
                    startRecording
                  }
                >
                  ▶ Start Answer
                </button>
              )}

            {/* STOP */}

            {isRecording && (
              <button
                type="button"
                className="stopRecordingButton"
                onClick={() =>
                  stopRecording(false)
                }
              >
                ■ Stop Recording
              </button>
            )}

            {/* NEXT */}

            {answerRecorded &&
              !isRecording && (
                <button
                  type="button"
                  className="nextQuestionButton"
                  onClick={nextQuestion}
                >
                  {currentQuestionIndex <
                  total - 1
                    ? "Next Question →"
                    : "Finish Interview ✓"}
                </button>
              )}

            {/* EXIT */}

            {answerRecorded &&
              !isRecording && (
                <button
                  type="button"
                  className="exitInterviewButton"
                  onClick={
                    exitInterview
                  }
                >
                  Exit Interview
                </button>
              )}

          </section>

        </div>
      </div>
    </div>
  );
}

export default InterviewPage;