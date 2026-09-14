import { useState } from "react";
import "../styles/studentPanel.css";

function StudentPage({
  studentName,
  setStudentName,
  studentEmail,
  setStudentEmail,
  selectedInterview,
  setSelectedInterview,
  interviews,
  startStudentInterview,
  setPage,
}) {
  const [showInstructions, setShowInstructions] = useState(false);
  const [instructionsAccepted, setInstructionsAccepted] = useState(false);

  const selectedInterviewData = interviews.find(
    (interview) =>
      String(interview.id) === String(selectedInterview)
  );

  const handleInterviewChange = (event) => {
    const interviewId = event.target.value;

    setSelectedInterview(interviewId);

    if (interviewId) {
      setInstructionsAccepted(false);
      setShowInstructions(true);
    }
  };

  const handleCloseInstructions = () => {
    setShowInstructions(false);
    setInstructionsAccepted(false);

    setSelectedInterview("");
  };

  const handleContinue = () => {
    if (!instructionsAccepted) return;

    setShowInstructions(false);
  };

  return (
    <div className="page">
      <div className="studentContainer">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="header">
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 11px",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: "700",
                marginBottom: "14px",
              }}
            >
              <span>●</span>
              Online Assessment
            </div>

            <h1>Star Steps Online Assessments</h1>

            <p>
              Complete your Assessment with confidence.
            </p>
          </div>
        </header>


        {/* =====================================================
            STUDENT FORM
        ===================================================== */}

        <section className="card">

          <div className="studentWelcome">

            <div className="studentWelcomeIcon">
              👋
            </div>

            <div>
              <h2
                style={{
                  margin: "0 0 5px",
                  fontSize: "25px",
                }}
              >
                Welcome!
              </h2>

              <p
                className="muted"
                style={{
                  margin: 0,
                  fontSize: "14px",
                }}
              >
                Enter your details below to begin your
                online interview.
              </p>
            </div>

          </div>


          {/* =================================================
              NAME
          ================================================= */}

          <label htmlFor="studentName">
            Student Name
          </label>

          <input
            id="studentName"
            className="textInput"
            type="text"
            placeholder="Enter your full name"
            value={studentName}
            onChange={(event) =>
              setStudentName(event.target.value)
            }
          />


          {/* =================================================
              EMAIL
          ================================================= */}

          <label htmlFor="studentEmail">
            Email Address
          </label>

          <input
            id="studentEmail"
            className="textInput"
            type="email"
            placeholder="Enter your email address"
            value={studentEmail}
            onChange={(event) =>
              setStudentEmail(event.target.value)
            }
          />


          {/* =================================================
              INTERVIEW
          ================================================= */}

          <label htmlFor="selectedInterview">
            Select Interview
          </label>

          <select
            id="selectedInterview"
            className="textInput"
            value={selectedInterview}
            onChange={handleInterviewChange}
          >
            <option value="">
              Select an assessment
            </option>

            {interviews.map((interview) => (
              <option
                key={interview.id}
                value={interview.id}
              >
                {interview.title}
              </option>
            ))}
          </select>


          {/* =================================================
              SELECTED INTERVIEW
          ================================================= */}

          {selectedInterview && (
            <div className="selectedInterview">

              <div className="selectedInterviewIcon">
                ✓
              </div>

              <div className="selectedInterviewContent">

                <div className="selectedInterviewLabel">
                  INTERVIEW SELECTED
                </div>

                <div className="selectedInterviewTitle">
                  {selectedInterviewData?.title ||
                    "Selected Interview"}
                </div>

              </div>

            </div>
          )}


          {/* =================================================
              START INTERVIEW
          ================================================= */}

          <button
            className="primaryButton fullButton studentStartButton"
            onClick={startStudentInterview}
          >
            Start Interview

            <span
              style={{
                marginLeft: "8px",
                fontSize: "18px",
              }}
            >
              →
            </span>
          </button>


          {/* =================================================
              REQUIREMENTS
          ================================================= */}

          <div className="studentRequirements">

            <span className="studentRequirement">
              🎥 Camera required
            </span>

            <span className="studentRequirement">
              🎙️ Microphone required
            </span>

            <span className="studentRequirement">
              🔒 Secure assessment
            </span>

          </div>

        </section>


        {/* =====================================================
            FOOTER NOTE
        ===================================================== */}

        <div className="studentFooterNote">
          Please make sure you are in a quiet and well-lit
          environment before starting.
        </div>

      </div>


      {/* =====================================================
          ASSESSMENT INSTRUCTIONS POPUP
      ===================================================== */}

      {showInstructions && (
        <div className="instructionsOverlay">

          <div className="instructionsModal">

            {/* =================================================
                POPUP HEADER
            ================================================= */}

            <div className="instructionsHeader">

              <div>

                <div className="instructionsIcon">
                  📋
                </div>

                <h2>
                  Assessment Instructions
                </h2>

                <p>
                  Please read the following instructions
                  carefully before starting.
                </p>

              </div>

              <button
                type="button"
                className="instructionsClose"
                onClick={handleCloseInstructions}
              >
                ×
              </button>

            </div>


            {/* =================================================
                SELECTED ASSESSMENT
            ================================================= */}

            <div className="instructionsAssessment">

              <span>
                Selected Assessment
              </span>

              <strong>
                {selectedInterviewData?.title ||
                  "Selected Assessment"}
              </strong>

            </div>


            {/* =================================================
                INSTRUCTIONS
            ================================================= */}

            <div className="instructionsList">

              {/* 1. VOLUME */}

              <div className="instructionItem">
                <span>🔊</span>

                <div>
                  <strong>
                    Set your device volume to full
                  </strong>

                  <p>
                    Before starting the interview, please
                    set your phone, laptop, or device media
                    volume to full so that you can clearly
                    hear the questions announced by the
                    executive.
                  </p>
                </div>

              </div>


              {/* 2. CAMERA & MICROPHONE */}

              <div className="instructionItem">
                <span>🎥</span>

                <div>
                  <strong>
                    Allow camera and microphone
                  </strong>

                  <p>
                    Please allow camera and microphone
                    permissions when requested by your
                    browser.
                  </p>
                </div>

              </div>


              {/* 3. ENVIRONMENT */}

              <div className="instructionItem">
                <span>💡</span>

                <div>
                  <strong>
                    Choose a suitable environment
                  </strong>

                  <p>
                    Sit in a quiet and well-lit place where
                    your face is clearly visible throughout
                    the assessment.
                  </p>
                </div>

              </div>


              {/* 4. INTERVIEW PROCESS */}

              <div className="instructionItem">
                <span>📌</span>

                <div>
                  <strong>
                    Listen to the question carefully
                  </strong>

                  <p>
                    Once you click the Start Assessment
                    button, your interview will begin.
                    The executive will first announce the
                    question. Listen to the question
                    carefully and then click the
                    <strong> Start Assessment </strong>
                    button to begin recording your answer.
                  </p>
                </div>

              </div>


              {/* 5. TIMER */}

              <div className="instructionItem">
                <span>⏱️</span>

                <div>
                  <strong>
                    The timer will continue running
                  </strong>

                  <p>
                    The timer will continue running while
                    you are answering. Make sure you complete
                    your answer within the given time.
                  </p>
                </div>

              </div>


              {/* 6. STOP ANSWER */}

              <div className="instructionItem">
                <span>⏹️</span>

                <div>
                  <strong>
                    Stop your answer when finished
                  </strong>

                  <p>
                    If you complete your answer before the
                    given time, click
                    <strong> Stop Answer </strong>
                    to stop recording and move to the next
                    question.
                  </p>
                </div>

              </div>


              {/* 7. DO NOT SWITCH TABS */}

              <div className="instructionItem">
                <span>🚫</span>

                <div>
                  <strong>
                    Do not switch tabs or close the page
                  </strong>

                  <p>
                    Please remain on the assessment page
                    throughout the interview. Do not refresh
                    the browser or close the page while the
                    assessment is in progress.
                  </p>
                </div>

              </div>


              {/* 8. VIDEO RECORDING */}

              <div className="instructionItem">
                <span>📹</span>

                <div>
                  <strong>
                    Your assessment will be recorded
                  </strong>

                  <p>
                    Your video and responses may be recorded
                    for assessment and evaluation purposes.
                  </p>
                </div>

              </div>


              {/* 9. NEXT QUESTION */}

              <div className="instructionItem">
                <span>➡️</span>

                <div>
                  <strong>
                    Move to the next question
                  </strong>

                  <p>
                    After completing your answer, click
                    <strong> Stop Answer </strong>
                    to proceed to the next question.
                  </p>
                </div>

              </div>


              {/* 10. FINISH */}

              <div className="instructionItem">
                <span>🏁</span>

                <div>
                  <strong>
                    Finish the assessment
                  </strong>

                  <p>
                    After completing all the questions,
                    a <strong>Finish</strong> button will
                    appear. Click the
                    <strong> Finish </strong>
                    button to complete and submit your
                    assessment.
                  </p>
                </div>

              </div>

            </div>


            {/* =================================================
                CHECKBOX
            ================================================= */}

            <label className="instructionsCheckbox">

              <input
                type="checkbox"
                checked={instructionsAccepted}
                onChange={(event) =>
                  setInstructionsAccepted(
                    event.target.checked
                  )
                }
              />

              <span>
                I have read and understood all the
                instructions.
              </span>

            </label>


            {/* =================================================
                CONTINUE BUTTON
            ================================================= */}

            <button
              type="button"
              className="primaryButton fullButton"
              disabled={!instructionsAccepted}
              onClick={handleContinue}
              style={{
                opacity: instructionsAccepted ? 1 : 0.5,
                cursor: instructionsAccepted
                  ? "pointer"
                  : "not-allowed",
              }}
            >
              Continue to Assessment

              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "18px",
                }}
              >
                →
              </span>

            </button>

          </div>

        </div>
      )}
    </div>
  );
}

export default StudentPage;