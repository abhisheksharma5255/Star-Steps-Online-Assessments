function AdminDashboard({
  adminLogout,
  interviews,
  answers,
  getGroupedSubmissions,
  interviewTitle,
  setInterviewTitle,
  questions,
  addQuestion,
  updateQuestion,
  updateQuestionTimeLimit,
  deleteQuestion,
  createInterview,
  loadInterviews,
  loadAnswers,
  loadingAnswers,
  deleteAssessment,
  getQuestionText,
  getQuestionTimeLimit,
  selectedSubmission,
  setSelectedSubmission,
  openAnswerVideo,
  downloadAnswer,
  deleteAnswer,
  downloadFullInterview,
  selectedAnswer,
  closeAnswerVideo,
  loadingAdminVideo,
  adminVideoUrl,
  formatFileSize,
  deleteFullInterview,
}) {
  const submissions = getGroupedSubmissions();

  return (
    <div className="page">
      <div className="container">
        <header className="header adminHeader">
          <div className="adminHeaderContent">
            <div>
              <div className="adminBadge">
                ADMIN PANEL
              </div>

              <h1 className="adminTitle">
                Star Steps Assessments
              </h1>

              <p className="adminDescription">
                Create assessments, manage questions and
                review student interviews.
              </p>
            </div>

            <button
              className="logoutButton"
              onClick={adminLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <div className="statsGrid">
          <div className="statCard">
            <div className="statLabel">ASSESSMENTS</div>

            <div className="statValue">
              {interviews.length}
            </div>
          </div>

          <div className="statCard">
            <div className="statLabel">ANSWERS</div>

            <div className="statValue">
              {answers.length}
            </div>
          </div>

          <div className="statCard">
            <div className="statLabel">
              STUDENT SUBMISSIONS
            </div>

            <div className="statValue">
              {submissions.length}
            </div>
          </div>
        </div>

        <section className="card">
          <div className="sectionHeader">
            <div>
              <div className="sectionEyebrow">
                CREATE
              </div>

              <h2 className="sectionTitle">
                Create Interview
              </h2>

              <p className="sectionDescription">
                Build a custom assessment with as many
                questions as you need.
              </p>
            </div>

            <div className="unlimitedBadge">
              Unlimited Questions
            </div>
          </div>

          <label className="formLabel">
            Interview Title
          </label>

          <input
            className="textInput"
            type="text"
            placeholder="Example: Cabin Crew Interview"
            value={interviewTitle}
            onChange={(event) =>
              setInterviewTitle(event.target.value)
            }
          />

          <div className="sectionHeader">
            <div>
              <h3 className="sectionTitle">
                Questions
              </h3>

              <p className="sectionDescription">
                Write exactly what the AI interviewer
                should ask.
              </p>
            </div>

            <button
              className="secondaryButton"
              onClick={addQuestion}
            >
              + Add Question
            </button>
          </div>

          {questions.map((question, index) => (
            <div
              className="questionRow"
              key={index}
            >
              <div className="questionRowTop">
                <div className="questionNumber">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="questionField">
                  <div className="questionLabel">
                    Question {index + 1}
                  </div>

                  <input
                    className="textInput"
                    type="text"
                    placeholder={
                      "Enter question " + (index + 1)
                    }
                    value={getQuestionText(question)}
                    onChange={(event) =>
                      updateQuestion(
                        index,
                        event.target.value
                      )
                    }
                  />
                </div>

                <button
                  className="deleteButton"
                  onClick={() =>
                    deleteQuestion(index)
                  }
                >
                  Delete
                </button>
              </div>

              <div className="questionTime">
                <span className="questionTimeLabel">
                  ⏱ Time Limit
                </span>

                <select
                  className="textInput"
                  value={
                    getQuestionTimeLimit(question)
                      ? "seconds"
                      : "none"
                  }
                  onChange={(event) => {
                    if (
                      event.target.value === "none"
                    ) {
                      updateQuestionTimeLimit(
                        index,
                        ""
                      );
                    } else {
                      updateQuestionTimeLimit(
                        index,
                        "60"
                      );
                    }
                  }}
                >
                  <option value="none">
                    No Time Limit
                  </option>

                  <option value="seconds">
                    Set Time Limit
                  </option>
                </select>

                {getQuestionTimeLimit(question) && (
                  <>
                    <input
                      className="textInput"
                      type="number"
                      min="1"
                      placeholder="Seconds"
                      value={getQuestionTimeLimit(
                        question
                      )}
                      onChange={(event) =>
                        updateQuestionTimeLimit(
                          index,
                          event.target.value
                        )
                      }
                    />

                    <span>seconds</span>
                  </>
                )}
              </div>
            </div>
          ))}

          <button
            className="primaryButton fullButton"
            onClick={createInterview}
          >
            + Create Interview
          </button>
        </section>

        <section className="card">
          <div className="sectionHeader">
            <div>
              <div className="sectionEyebrow">
                MANAGE
              </div>

              <h2 className="sectionTitle">
                My Interviews
              </h2>

              <p className="sectionDescription">
                Your created assessments.
              </p>
            </div>

            <button
              className="secondaryButton"
              onClick={loadInterviews}
            >
              ↻ Refresh
            </button>
          </div>

          {interviews.length === 0 ? (
            <div className="emptyState">
              <div className="emptyIcon">📋</div>

              <h3 className="emptyTitle">
                No interviews yet
              </h3>

              <p className="muted">
                Create your first assessment above.
              </p>
            </div>
          ) : (
            interviews.map((interview) => (
              <div
                className="interviewCard"
                key={interview.id}
              >
                <div className="interviewHeader">
                  <div>
                    <div className="assessmentBadge">
                      ASSESSMENT
                    </div>

                    <h3 className="interviewTitle">
                      {interview.title}
                    </h3>

                    <p className="muted">
                      {interview.questions.length}{" "}
                      question
                      {interview.questions.length !== 1
                        ? "s"
                        : ""}
                    </p>
                  </div>

                  <button
                    className="deleteButton"
                    onClick={() =>
                      deleteAssessment(interview)
                    }
                  >
                    Delete Assessment
                  </button>
                </div>

                <div className="questionList">
                  {interview.questions.map(
                    (question, index) => (
                      <div
                        className="questionItem"
                        key={index}
                      >
                        <span className="questionItemNumber">
                          {index + 1}
                        </span>

                        <div className="questionItemText">
                          {getQuestionText(question)}
                        </div>

                        {getQuestionTimeLimit(
                          question
                        ) && (
                          <span className="timeBadge">
                            ⏱{" "}
                            {getQuestionTimeLimit(
                              question
                            )}{" "}
                            sec
                          </span>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            ))
          )}
        </section>

        <section className="card">
          <div className="sectionHeader">
            <div>
              <div className="sectionEyebrow">
                RESPONSES
              </div>

              <h2 className="sectionTitle">
                Student Submissions
              </h2>

              <p className="sectionDescription">
                Review every recorded answer submitted
                by students.
              </p>
            </div>

            <button
              className="secondaryButton"
              onClick={loadAnswers}
              disabled={loadingAnswers}
            >
              {loadingAnswers
                ? "Loading..."
                : "↻ Refresh"}
            </button>
          </div>

          {submissions.length === 0 ? (
            <div className="emptyState">
              <div className="emptyIcon">🎥</div>

              <h3 className="emptyTitle">
                No submissions yet
              </h3>

              <p className="muted">
                Student interview submissions will
                appear here.
              </p>
            </div>
          ) : (
            <div>
              {submissions.map(
                (submission, index) => (
                  <div
                    className="interviewCard"
                    key={
                      submission.studentEmail +
                      "_" +
                      submission.interviewId +
                      "_" +
                      index
                    }
                  >
                    <div className="interviewHeader">
                      <div className="submissionStudentInfo">
                        <div className="studentAvatar">
                          {String(
                            submission.studentName || "S"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <h3>
                            {submission.studentName}
                          </h3>

                          <p className="muted">
                            {submission.studentEmail}
                          </p>

                          <p>
                            <strong>
                              {
                                submission.interviewTitle
                              }
                            </strong>
                          </p>
                        </div>
                      </div>

                      <div className="answerCountBadge">
                        {submission.answers.length}{" "}
                        Answer
                        {submission.answers.length !== 1
                          ? "s"
                          : ""}
                      </div>
                    </div>

                    <div>
                      {submission.answers.map(
                        (answer) => (
                          <div
                            key={answer._id}
                            className="questionItem"
                          >
                            <div>
                              <div className="assessmentBadge">
                                QUESTION{" "}
                                {answer.questionIndex}
                              </div>

                              <p>{answer.question}</p>
                            </div>

                            <div className="submissionActions">
                              <button
                                className="primaryButton"
                                onClick={() =>
                                  openAnswerVideo(
                                    answer
                                  )
                                }
                              >
                                ▶ Watch
                              </button>

                              <button
                                className="secondaryButton"
                                onClick={() =>
                                  downloadAnswer(
                                    answer
                                  )
                                }
                              >
                                ↓ Download
                              </button>

                              <button
                                className="deleteButton"
                                onClick={() =>
                                  deleteAnswer(answer)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    <div className="submissionFooterActions">
                      <button
                        className="primaryButton"
                        onClick={() =>
                          setSelectedSubmission(
                            submission
                          )
                        }
                      >
                        View Full Interview
                      </button>

                      <button
                        className="secondaryButton"
                        onClick={() =>
                          downloadFullInterview(
                            submission
                          )
                        }
                      >
                        ↓ Download All
                      </button>

                      <button
                        className="deleteButton"
                        onClick={() =>
                          deleteFullInterview(
                            submission
                          )
                        }
                      >
                        Delete Full Interview
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {selectedSubmission && (
          <div className="modalOverlay">
            <div className="modalCard">
              <div className="sectionHeader">
                <div>
                  <div className="sectionEyebrow">
                    STUDENT INTERVIEW
                  </div>

                  <h2>Full Interview</h2>

                  <p className="muted">
                    {selectedSubmission.studentName} •{" "}
                    {selectedSubmission.interviewTitle}
                  </p>
                </div>

                <button
                  className="secondaryButton"
                  onClick={() =>
                    setSelectedSubmission(null)
                  }
                >
                  Close
                </button>
              </div>

              <div className="questionItem">
                <strong>
                  {selectedSubmission.studentName}
                </strong>

                <p className="muted">
                  {selectedSubmission.studentEmail}
                </p>

                <p>
                  {selectedSubmission.interviewTitle}
                </p>

                <div className="answerCountBadge">
                  {selectedSubmission.answers.length}{" "}
                  Answers Submitted
                </div>
              </div>

              <div>
                {selectedSubmission.answers.map(
                  (answer) => (
                    <div
                      key={answer._id}
                      className="questionItem"
                    >
                      <div className="assessmentBadge">
                        QUESTION {answer.questionIndex}
                      </div>

                      <p>{answer.question}</p>

                      <div className="submissionActions">
                        <button
                          className="primaryButton"
                          onClick={() =>
                            openAnswerVideo(answer)
                          }
                        >
                          ▶ Watch Answer
                        </button>

                        <button
                          className="secondaryButton"
                          onClick={() =>
                            downloadAnswer(answer)
                          }
                        >
                          ↓ Download
                        </button>

                        <button
                          className="deleteButton"
                          onClick={() =>
                            deleteAnswer(answer)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="modalActions">
                <button
                  className="secondaryButton"
                  onClick={() =>
                    downloadFullInterview(
                      selectedSubmission
                    )
                  }
                >
                  ↓ Download All Videos
                </button>

                <button
                  className="deleteButton"
                  onClick={() =>
                    deleteFullInterview(
                      selectedSubmission
                    )
                  }
                >
                  Delete Full Interview
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedAnswer && (
          <div className="modalOverlay">
            <div className="modalCard">
              <div className="sectionHeader">
                <div>
                  <div className="sectionEyebrow">
                    VIDEO RESPONSE
                  </div>

                  <h2>Answer Video</h2>

                  <p className="muted">
                    {selectedAnswer.studentName} •
                    Question{" "}
                    {selectedAnswer.questionIndex}
                  </p>
                </div>

                <button
                  className="secondaryButton"
                  onClick={closeAnswerVideo}
                >
                  Close
                </button>
              </div>

              <div className="questionItem">
                <div className="assessmentBadge">
                  QUESTION
                </div>

                <h3>{selectedAnswer.question}</h3>
              </div>

              {loadingAdminVideo ? (
                <div className="emptyState">
                  <div className="emptyIcon">⏳</div>

                  <strong>
                    Loading video...
                  </strong>

                  <p className="muted">
                    Please wait while the answer
                    video loads.
                  </p>
                </div>
              ) : adminVideoUrl ? (
                <video
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="videoPreview"
                  src={adminVideoUrl}
                >
                  Your browser does not support video
                  playback.
                </video>
              ) : (
                <div className="emptyState">
                  <strong>
                    Video could not be loaded.
                  </strong>
                </div>
              )}

              <div className="modalActions">
                <button
                  className="secondaryButton"
                  onClick={() =>
                    downloadAnswer(selectedAnswer)
                  }
                >
                  ↓ Download Video
                </button>

                <button
                  className="deleteButton"
                  onClick={() =>
                    deleteAnswer(selectedAnswer)
                  }
                >
                  Delete Answer
                </button>
              </div>

              <div className="answerMeta">
                <p>
                  <strong>Student:</strong>{" "}
                  {selectedAnswer.studentName}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {selectedAnswer.studentEmail}
                </p>

                <p>
                  <strong>Interview:</strong>{" "}
                  {selectedAnswer.interviewTitle}
                </p>

                <p>
                  <strong>Video Size:</strong>{" "}
                  {formatFileSize(
                    selectedAnswer.videoSize
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;