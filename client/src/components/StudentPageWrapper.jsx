import StudentPage from "./StudentPage";


function StudentPageWrapper({
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
  return (
    <StudentPage
      studentName={studentName}
      setStudentName={setStudentName}
      studentEmail={studentEmail}
      setStudentEmail={setStudentEmail}
      selectedInterview={selectedInterview}
      setSelectedInterview={setSelectedInterview}
      interviews={interviews}
      startStudentInterview={startStudentInterview}
      setPage={setPage}
    />
  );
}

export default StudentPageWrapper;