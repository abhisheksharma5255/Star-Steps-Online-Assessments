import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

function AdminPage({
  isAdminLoggedIn,

  adminEmail,
  setAdminEmail,
  adminPassword,
  setAdminPassword,
  adminError,
  adminLoading,
  adminLogin,

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
  // ========================================================
  // ADMIN LOGIN
  // ========================================================

  if (!isAdminLoggedIn) {
    return (
      <AdminLogin
        adminEmail={adminEmail}
        setAdminEmail={setAdminEmail}
        adminPassword={adminPassword}
        setAdminPassword={setAdminPassword}
        adminError={adminError}
        adminLoading={adminLoading}
        adminLogin={adminLogin}
      />
    );
  }

  // ========================================================
  // ADMIN DASHBOARD
  // ========================================================

  return (
    <AdminDashboard
      adminLogout={adminLogout}
      interviews={interviews}
      answers={answers}
      getGroupedSubmissions={
        getGroupedSubmissions
      }
      interviewTitle={interviewTitle}
      setInterviewTitle={setInterviewTitle}
      questions={questions}
      addQuestion={addQuestion}
      updateQuestion={updateQuestion}
      updateQuestionTimeLimit={
        updateQuestionTimeLimit
      }
      deleteQuestion={deleteQuestion}
      createInterview={createInterview}
      loadInterviews={loadInterviews}
      loadAnswers={loadAnswers}
      loadingAnswers={loadingAnswers}
      deleteAssessment={deleteAssessment}
      getQuestionText={getQuestionText}
      getQuestionTimeLimit={
        getQuestionTimeLimit
      }
      selectedSubmission={selectedSubmission}
      setSelectedSubmission={
        setSelectedSubmission
      }
      openAnswerVideo={openAnswerVideo}
      downloadAnswer={downloadAnswer}
      deleteAnswer={deleteAnswer}
      downloadFullInterview={
        downloadFullInterview
      }
      selectedAnswer={selectedAnswer}
      closeAnswerVideo={closeAnswerVideo}
      loadingAdminVideo={loadingAdminVideo}
      adminVideoUrl={adminVideoUrl}
      formatFileSize={formatFileSize}
      deleteFullInterview={deleteFullInterview}
    />
  );
}

export default AdminPage;