import { useEffect, useState } from "react";

function useAdmin({
  API_URL,
  navigateTo,
  setInterviews,
  loadInterviews,
}) {
  // =====================================================
  // ADMIN AUTH STATE
  // =====================================================

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    Boolean(localStorage.getItem("adminToken"))
  );

  // =====================================================
  // ADMIN ANSWERS STATE
  // =====================================================

  const [answers, setAnswers] = useState([]);
  const [loadingAnswers, setLoadingAnswers] = useState(false);

  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // =====================================================
  // ADMIN VIDEO STATE
  // =====================================================

  const [adminVideoUrl, setAdminVideoUrl] = useState(null);
  const [loadingAdminVideo, setLoadingAdminVideo] = useState(false);

  // =====================================================
  // ADMIN HEADERS
  // =====================================================

  function getAdminHeaders() {
    const token = localStorage.getItem("adminToken");

    return {
      Authorization: "Bearer " + token,
    };
  }

  // =====================================================
  // ADMIN LOGIN
  // =====================================================

  async function adminLogin(event) {
    event.preventDefault();

    setAdminError("");

    if (!adminEmail.trim() || !adminPassword) {
      setAdminError("Please enter email and password.");
      return;
    }

    try {
      setAdminLoading(true);

      const response = await fetch(API_URL + "/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: adminEmail.trim(),
          password: adminPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (!data.token) {
        throw new Error("Login token was not received.");
      }

      localStorage.setItem("adminToken", data.token);

      setIsAdminLoggedIn(true);
      setAdminEmail("");
      setAdminPassword("");
      setAdminError("");

      navigateTo("admin");
    } catch (error) {
      console.error("Admin login failed:", error);
      setAdminError(error.message || "Invalid email or password.");
    } finally {
      setAdminLoading(false);
    }
  }

  // =====================================================
  // ADMIN LOGOUT
  // =====================================================

  function adminLogout() {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;

    if (adminVideoUrl) {
      URL.revokeObjectURL(adminVideoUrl);
    }

    localStorage.removeItem("adminToken");

    setIsAdminLoggedIn(false);
    setAnswers([]);
    setSelectedSubmission(null);
    setSelectedAnswer(null);
    setAdminVideoUrl(null);
    setLoadingAdminVideo(false);

    navigateTo("admin");
  }

  // =====================================================
  // LOAD ALL ANSWERS
  // =====================================================

  async function loadAnswers() {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      setIsAdminLoggedIn(false);
      return;
    }

    try {
      setLoadingAnswers(true);

      const response = await fetch(
        API_URL + "/api/admin/answers",
        {
          headers: getAdminHeaders(),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        setIsAdminLoggedIn(false);
        setAnswers([]);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load answers");
      }

      setAnswers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load answers:", error);
    } finally {
      setLoadingAnswers(false);
    }
  }

  // =====================================================
  // LOAD ADMIN VIDEO
  // =====================================================

  async function loadAdminVideo(answer) {
    if (!answer?._id) return;

    const token = localStorage.getItem("adminToken");

    if (!token) {
      setIsAdminLoggedIn(false);
      return;
    }

    try {
      setLoadingAdminVideo(true);

      if (adminVideoUrl) {
        URL.revokeObjectURL(adminVideoUrl);
        setAdminVideoUrl(null);
      }

      const response = await fetch(
        API_URL + "/api/admin/answers/" + answer._id + "/video",
        {
          headers: getAdminHeaders(),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        setIsAdminLoggedIn(false);
        return;
      }

      if (!response.ok) {
        let message = "Failed to load video.";

        try {
          const data = await response.json();
          message = data.message || message;
        } catch {
          // Ignore JSON parsing failure.
        }

        throw new Error(message);
      }

      const blob = await response.blob();

      if (!blob || blob.size === 0) {
        throw new Error("Video file is empty.");
      }

      const videoUrl = URL.createObjectURL(blob);

      setAdminVideoUrl(videoUrl);
    } catch (error) {
      console.error("Failed to load admin video:", error);
      alert(error.message || "Failed to load video.");
    } finally {
      setLoadingAdminVideo(false);
    }
  }

  // =====================================================
  // OPEN ANSWER VIDEO
  // =====================================================

  async function openAnswerVideo(answer) {
    if (adminVideoUrl) {
      URL.revokeObjectURL(adminVideoUrl);
      setAdminVideoUrl(null);
    }

    setSelectedAnswer(answer);

    await loadAdminVideo(answer);
  }

  // =====================================================
  // CLOSE ANSWER VIDEO
  // =====================================================

  function closeAnswerVideo() {
    if (adminVideoUrl) {
      URL.revokeObjectURL(adminVideoUrl);
    }

    setAdminVideoUrl(null);
    setSelectedAnswer(null);
    setLoadingAdminVideo(false);
  }

  // =====================================================
  // GROUP SUBMISSIONS
  // =====================================================

  function getGroupedSubmissions() {
    const grouped = {};

    answers.forEach((answer) => {
      const studentEmail = (
        answer.studentEmail || ""
      ).toLowerCase();

      const interviewId =
        answer.interviewId || "unknown";

      const key =
        studentEmail + "_" + interviewId;

      if (!grouped[key]) {
        grouped[key] = {
          studentName: answer.studentName || "Unknown Student",
          studentEmail: answer.studentEmail || "",
          interviewId,
          interviewTitle:
            answer.interviewTitle || "Untitled Interview",
          answers: [],
        };
      }

      grouped[key].answers.push(answer);
    });

    return Object.values(grouped).map((submission) => ({
      ...submission,
      answers: submission.answers.sort(
        (a, b) =>
          Number(a.questionIndex || 0) -
          Number(b.questionIndex || 0)
      ),
    }));
  }

  // =====================================================
  // DOWNLOAD SINGLE ANSWER
  // =====================================================

  async function downloadAnswer(answer) {
    if (!answer?._id) return;

    const token = localStorage.getItem("adminToken");

    if (!token) {
      setIsAdminLoggedIn(false);
      return;
    }

    try {
      const response = await fetch(
        API_URL + "/api/admin/answers/" + answer._id + "/download",
        {
          headers: getAdminHeaders(),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        setIsAdminLoggedIn(false);
        return;
      }

      if (!response.ok) {
        let message = "Download failed.";

        try {
          const data = await response.json();
          message = data.message || message;
        } catch {
          // Ignore JSON parsing failure.
        }

        throw new Error(message);
      }

      const blob = await response.blob();

      if (!blob || blob.size === 0) {
        throw new Error("Downloaded file is empty.");
      }

      const url = URL.createObjectURL(blob);

      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download =
        answer.videoFilename || "student-answer.webm";

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error("Download failed:", error);
      alert(error.message || "Failed to download video.");
    }
  }

  // =====================================================
  // DELETE SINGLE ANSWER
  // =====================================================

  async function deleteAnswer(answer) {
    if (!answer?._id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this answer video?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("adminToken");

    if (!token) {
      setIsAdminLoggedIn(false);
      return;
    }

    try {
      const response = await fetch(
        API_URL + "/api/admin/answers/" + answer._id,
        {
          method: "DELETE",
          headers: getAdminHeaders(),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        setIsAdminLoggedIn(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete answer."
        );
      }

      if (
        selectedAnswer &&
        selectedAnswer._id === answer._id
      ) {
        closeAnswerVideo();
      }

      setAnswers((oldAnswers) =>
        oldAnswers.filter(
          (item) => item._id !== answer._id
        )
      );

      await loadAnswers();

      alert("Answer deleted successfully.");
    } catch (error) {
      console.error("Delete answer failed:", error);
      alert(error.message || "Failed to delete answer.");
    }
  }

  // =====================================================
  // DELETE FULL INTERVIEW SUBMISSION
  // =====================================================

  async function deleteFullInterview(submission) {
    if (!submission?.answers?.length) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete the complete interview submission for this student?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("adminToken");

    if (!token) {
      setIsAdminLoggedIn(false);
      return;
    }

    let failedCount = 0;

    try {
      for (const answer of submission.answers) {
        try {
          const response = await fetch(
            API_URL +
              "/api/admin/answers/" +
              answer._id,
            {
              method: "DELETE",
              headers: getAdminHeaders(),
            }
          );

          if (response.status === 401) {
            localStorage.removeItem("adminToken");
            setIsAdminLoggedIn(false);
            return;
          }

          if (!response.ok) {
            failedCount++;
          }
        } catch (error) {
          console.error(
            "Failed to delete answer:",
            answer._id,
            error
          );

          failedCount++;
        }
      }

      closeAnswerVideo();
      setSelectedSubmission(null);

      await loadAnswers();

      if (failedCount > 0) {
        alert(
          `Interview deleted with ${failedCount} failed deletion(s).`
        );
      } else {
        alert("Complete interview submission deleted successfully.");
      }
    } catch (error) {
      console.error(
        "Delete full interview failed:",
        error
      );

      alert(
        error.message ||
          "Failed to delete complete interview."
      );
    }
  }

  // =====================================================
  // DELETE ASSESSMENT
  // =====================================================

  async function deleteAssessment(interview) {
    if (!interview?.id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this assessment? All related student answers will also be deleted."
    );

    if (!confirmed) return;

    const token = localStorage.getItem("adminToken");

    if (!token) {
      setIsAdminLoggedIn(false);
      return;
    }

    try {
      const relatedAnswers = answers.filter(
        (answer) =>
          answer.interviewId === interview.id
      );

      let failedAnswerDeletes = 0;

      for (const answer of relatedAnswers) {
        try {
          const response = await fetch(
            API_URL +
              "/api/admin/answers/" +
              answer._id,
            {
              method: "DELETE",
              headers: getAdminHeaders(),
            }
          );

          if (response.status === 401) {
            localStorage.removeItem("adminToken");
            setIsAdminLoggedIn(false);
            return;
          }

          if (!response.ok) {
            failedAnswerDeletes++;
          }
        } catch (error) {
          console.error(
            "Failed to delete related answer:",
            answer._id,
            error
          );

          failedAnswerDeletes++;
        }
      }

      const response = await fetch(
        API_URL +
          "/api/interviews/" +
          interview.id,
        {
          method: "DELETE",
          headers: getAdminHeaders(),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        setIsAdminLoggedIn(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete assessment."
        );
      }

      setInterviews((oldInterviews) =>
        oldInterviews.filter(
          (item) => item.id !== interview.id
        )
      );

      setAnswers((oldAnswers) =>
        oldAnswers.filter(
          (answer) =>
            answer.interviewId !== interview.id
        )
      );

      closeAnswerVideo();
      setSelectedSubmission(null);

      await loadInterviews();
      await loadAnswers();

      if (failedAnswerDeletes > 0) {
        alert(
          `Assessment deleted, but ${failedAnswerDeletes} answer(s) could not be deleted.`
        );
      } else {
        alert("Assessment deleted successfully.");
      }
    } catch (error) {
      console.error(
        "Delete assessment failed:",
        error
      );

      alert(
        error.message ||
          "Failed to delete assessment."
      );
    }
  }

  // =====================================================
  // DOWNLOAD FULL INTERVIEW
  // =====================================================

  async function downloadFullInterview(submission) {
    if (!submission?.answers?.length) {
      alert("No answer videos available.");
      return;
    }

    for (let index = 0; index < submission.answers.length; index++) {
      await downloadAnswer(submission.answers[index]);

      if (index < submission.answers.length - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, 700)
        );
      }
    }
  }

  // =====================================================
  // CLEANUP ADMIN VIDEO URL
  // =====================================================

  useEffect(() => {
    return () => {
      if (adminVideoUrl) {
        URL.revokeObjectURL(adminVideoUrl);
      }
    };
  }, [adminVideoUrl]);

  // =====================================================
  // RETURN
  // =====================================================

  return {
    // Auth
    adminEmail,
    setAdminEmail,
    adminPassword,
    setAdminPassword,
    adminError,
    adminLoading,
    isAdminLoggedIn,

    // Answers
    answers,
    loadingAnswers,

    // Selection
    selectedSubmission,
    setSelectedSubmission,
    selectedAnswer,
    setSelectedAnswer,

    // Video
    adminVideoUrl,
    loadingAdminVideo,

    // Functions
    adminLogin,
    adminLogout,
    getAdminHeaders,
    loadAnswers,
    loadAdminVideo,
    openAnswerVideo,
    closeAnswerVideo,
    getGroupedSubmissions,
    downloadAnswer,
    deleteAnswer,
    deleteFullInterview,
    deleteAssessment,
    downloadFullInterview,
  };
}

export default useAdmin;

