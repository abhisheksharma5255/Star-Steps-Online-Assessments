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
  const selectedInterviewData = interviews.find(
    (interview) =>
      String(interview.id) === String(selectedInterview)
  );

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
              Complete your interview with confidence.
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
            onChange={(event) =>
              setSelectedInterview(event.target.value)
            }
          >
            <option value="">
              Select an interview
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
    </div>
  );
}

export default StudentPage;