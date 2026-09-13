import { useState } from "react";

function useInterviews({ API_URL }) {
// =========================
// INTERVIEW DATA
// =========================

const [interviewTitle, setInterviewTitle] =
useState("");

const [questions, setQuestions] = useState([
{
text: "",
timeLimit: null,
},
]);

const [interviews, setInterviews] =
useState([]);

// =========================
// QUESTION HELPERS
// =========================

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


if (
  question?.timeLimit === null ||
  question?.timeLimit === undefined ||
  question?.timeLimit === ""
) {
  return null;
}

const value = Number(question.timeLimit);

return value > 0 ? value : null;


}

// =========================
// LOAD INTERVIEWS
// =========================

async function loadInterviews() {
try {
const response = await fetch(
API_URL + "/api/interviews"
);


  if (!response.ok) {
    throw new Error(
      "Failed to load interviews"
    );
  }

  const data = await response.json();

  const normalizedInterviews =
    data.map((interview) => ({
      ...interview,
      id:
        interview._id ||
        interview.id,
    }));

  setInterviews(normalizedInterviews);
} catch (error) {
  console.error(
    "Could not load interviews:",
    error
  );
}


}

// =========================
// ADD QUESTION
// =========================

function addQuestion() {
setQuestions((oldQuestions) => [
...oldQuestions,
{
text: "",
timeLimit: null,
},
]);
}

// =========================
// UPDATE QUESTION
// =========================

function updateQuestion(index, value) {
setQuestions((oldQuestions) =>
oldQuestions.map((question, i) =>
i === index
? {
...(typeof question === "string"
? {
text: question,
timeLimit: null,
}
: question),
text: value,
}
: question
)
);
}

// =========================
// UPDATE QUESTION TIME
// =========================

function updateQuestionTimeLimit(
index,
value
) {
setQuestions((oldQuestions) =>
oldQuestions.map((question, i) =>
i === index
? {
...(typeof question === "string"
? {
text: question,
}
: question),
timeLimit:
value === ""
? null
: Number(value),
}
: question
)
);
}

// =========================
// DELETE QUESTION
// =========================

function deleteQuestion(index) {
setQuestions((oldQuestions) => {
if (oldQuestions.length === 1) {
return [
{
text: "",
timeLimit: null,
},
];
}


  return oldQuestions.filter(
    (_, i) => i !== index
  );
});


}

// =========================
// CREATE INTERVIEW
// =========================

async function createInterview() {
const title =
interviewTitle.trim();


const finalQuestions =
  questions
    .map((question) => ({
      text:
        getQuestionText(
          question
        ).trim(),

      timeLimit:
        getQuestionTimeLimit(
          question
        ),
    }))
    .filter(
      (question) =>
        question.text !== ""
    );

if (!title) {
  alert(
    "Please enter interview title."
  );
  return;
}

if (finalQuestions.length === 0) {
  alert(
    "Please add at least one question."
  );
  return;
}

const token =
  localStorage.getItem(
    "adminToken"
  );

if (!token) {
  alert(
    "Admin login required."
  );

  return;
}

try {
  const response = await fetch(
    API_URL +
      "/api/interviews",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          "Bearer " + token,
      },

      body: JSON.stringify({
        title,
        questions:
          finalQuestions,
      }),
    }
  );

  if (response.status === 401) {
    localStorage.removeItem(
      "adminToken"
    );

    alert(
      "Admin session expired. Please login again."
    );

    return;
  }

  if (!response.ok) {
    const data =
      await response
        .json()
        .catch(() => ({}));

    throw new Error(
      data.message ||
        "Failed to create interview"
    );
  }

  const interviewData =
    await response.json();

  const interview = {
    ...interviewData,
    id:
      interviewData._id ||
      interviewData.id,
  };

  setInterviews(
    (oldInterviews) => [
      interview,
      ...oldInterviews,
    ]
  );

  setInterviewTitle("");

  setQuestions([
    {
      text: "",
      timeLimit: null,
    },
  ]);

  alert(
    "Interview created successfully!"
  );
} catch (error) {
  console.error(error);

  alert(
    error.message ||
      "Could not create interview."
  );
}


}

return {
interviewTitle,
setInterviewTitle,


questions,
setQuestions,

interviews,
setInterviews,

getQuestionText,
getQuestionTimeLimit,

loadInterviews,

addQuestion,
updateQuestion,
updateQuestionTimeLimit,
deleteQuestion,

createInterview,


};
}

export default useInterviews;
