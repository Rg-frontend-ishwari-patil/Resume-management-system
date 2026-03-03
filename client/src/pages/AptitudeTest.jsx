import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const QUESTIONS = [
  {
    id: 1,
    question: "If 5x = 20, what is x?",
    options: ["2", "3", "4", "5"],
    answerIndex: 2,
  },
  {
    id: 2,
    question: "Which of the following is the smallest?",
    options: ["0.5", "0.05", "0.005", "0.15"],
    answerIndex: 2,
  },
  {
    id: 3,
    question: "What comes next in the series: 2, 4, 8, 16, ?",
    options: ["20", "24", "32", "30"],
    answerIndex: 2,
  },
  {
    id: 4,
    question: "A clock shows 3:00 PM. What is the angle between the hour and minute hands?",
    options: ["0°", "90°", "180°", "270°"],
    answerIndex: 1,
  },
  {
    id: 5,
    question: "If a train travels 60 km in 1.5 hours, what is its speed?",
    options: ["30 km/h", "40 km/h", "45 km/h", "50 km/h"],
    answerIndex: 2,
  },
  {
    id: 6,
    question: "Which number is a prime number?",
    options: ["21", "29", "33", "39"],
    answerIndex: 1,
  },
  {
    id: 7,
    question: "If 12% of a number is 24, what is the number?",
    options: ["100", "150", "180", "200"],
    answerIndex: 3,
  },
  {
    id: 8,
    question: "What is 3/5 of 200?",
    options: ["80", "100", "120", "150"],
    answerIndex: 2,
  },
  {
    id: 9,
    question: "Find the missing term: 7, 14, 21, ?, 35",
    options: ["24", "25", "28", "30"],
    answerIndex: 2,
  },
  {
    id: 10,
    question: "If the ratio of boys to girls is 3:2 and there are 30 students, how many are boys?",
    options: ["12", "15", "18", "20"],
    answerIndex: 2,
  },
];

const AptitudeTest = () => {
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({}); // {questionId: optionIndex}
  const [showCongrats, setShowCongrats] = useState(false);
  const [scoreState, setScoreState] = useState({ score: 0, total: QUESTIONS.length });
  const [showReview, setShowReview] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const jobId = location.state?.jobId || null;

  const handleStart = () => {
    setStarted(true);
    setSubmitted(false);
    setAnswers({});
  };

  const handleOptionChange = (qId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
  };

  const totalQuestions = QUESTIONS.length;

  const handleSubmit = async (e) => {
    e.preventDefault();

    let correctCount = 0;
    QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.answerIndex) correctCount += 1;
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = correctCount >= 7;

    setScoreState({ score: correctCount, total: totalQuestions, percentage });
    setSubmitted(true);

    // Save result to backend if we know the job
    if (jobId) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `http://localhost:7878/api/v1/jobapplication/candidate/aptitude-result/${jobId}`,
          { score: correctCount, total: totalQuestions },
          {
            headers: {
              Authorization: token,
            },
          }
        );
      } catch (error) {
        console.error("Failed to save aptitude result", error);
      }
    }

    if (passed) {
      setShowCongrats(true);
    }
  };

  const percentage = submitted ? scoreState.percentage : 0;
  const correctCount = submitted ? scoreState.score : 0;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg rounded-4">
            <div className="card-body p-4 p-md-5">
              <h2 className="mb-3 fw-bold text-center">Aptitude Test</h2>

              {!started && (
                <>
                  <p className="text-muted text-center mb-4">
                    You will get <strong>{totalQuestions}</strong> multiple-choice
                    questions. Please read the instructions carefully and start
                    the test when you are ready.
                  </p>

                  <ul className="text-muted mb-4">
                    <li>Make sure you have a stable internet connection.</li>
                    <li>Do not refresh or close the browser during the test.</li>
                    <li>Each question has only one correct answer.</li>
                  </ul>

                  <div className="d-flex justify-content-center">
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={handleStart}
                    >
                      Start Test
                    </button>
                  </div>
                </>
              )}

              {started && (
                <form onSubmit={handleSubmit} className="mt-3">
                  {QUESTIONS.map((q, index) => (
                    <div key={q.id} className="mb-4">
                      <h5>
                        Q{index + 1}. {q.question}
                      </h5>
                      {q.options.map((opt, optIndex) => (
                        <div className="form-check" key={optIndex}>
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`question-${q.id}`}
                            id={`q${q.id}-opt${optIndex}`}
                            checked={answers[q.id] === optIndex}
                            onChange={() => handleOptionChange(q.id, optIndex)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`q${q.id}-opt${optIndex}`}
                          >
                            {opt}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}

                  {!submitted && (
                    <div className="d-flex justify-content-center mt-4">
                      <button type="submit" className="btn btn-success btn-lg">
                        Submit Test
                      </button>
                    </div>
                  )}

                  {submitted && !showReview && (
                    <div className="mt-4 text-center">
                      <h4 className="fw-bold mb-2">
                        Your Score: {correctCount} / {totalQuestions} ({percentage}% )
                      </h4>
                      <p className="text-muted mb-2">
                        {percentage >= 60
                          ? "Congratulations! You have passed the aptitude test."
                          : "You scored below 60%. You can practice more and retake the test if allowed."}
                      </p>
                      <div className="d-flex gap-2 justify-content-center mt-3">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => setShowReview(true)}
                        >
                          View Results
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={handleStart}
                        >
                          Retake Test
                        </button>
                      </div>
                    </div>
                  )}

                  {submitted && showReview && (
                    <div className="mt-4">
                      <div className="text-center mb-4">
                        <h4 className="fw-bold mb-2">
                          Detailed Results: {correctCount} / {totalQuestions} ({percentage}% )
                        </h4>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => setShowReview(false)}
                        >
                          ← Back to Score
                        </button>
                      </div>

                      {QUESTIONS.map((q, index) => {
                        const userAnswer = answers[q.id];
                        const isCorrect = userAnswer === q.answerIndex;

                        return (
                          <div
                            key={q.id}
                            className="mb-4 p-3 border rounded"
                            style={{
                              backgroundColor: isCorrect ? "#d4edda" : "#f8d7da",
                              borderColor: isCorrect ? "#c3e6cb" : "#f5c6cb",
                            }}
                          >
                            <div className="d-flex align-items-start gap-2">
                              <span
                                style={{
                                  fontSize: "20px",
                                  fontWeight: "bold",
                                  color: isCorrect ? "#28a745" : "#dc3545",
                                }}
                              >
                                {isCorrect ? "✓" : "✗"}
                              </span>
                              <div className="flex-grow-1">
                                <h6 className="mb-2">
                                  Q{index + 1}. {q.question}
                                </h6>

                                <div className="mb-1">
                                  <strong>Your Answer:</strong>{" "}
                                  <span
                                    style={{
                                      color: isCorrect ? "#28a745" : "#dc3545",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {userAnswer !== undefined
                                      ? q.options[userAnswer]
                                      : "Not answered"}
                                  </span>
                                </div>

                                {!isCorrect && (
                                  <div>
                                    <strong>Correct Answer:</strong>{" "}
                                    <span
                                      style={{
                                        color: "#28a745",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {q.options[q.answerIndex]}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <div className="text-center mt-4">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleStart}
                        >
                          Retake Test
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              )}
              {showCongrats && (
                <div
                  className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
                >
                  <div className="card shadow-lg border-0" style={{ maxWidth: "420px", width: "100%" }}>
                    <div className="card-body p-4 text-center">
                      <div className="mb-3">
                        <span
                          className="d-inline-flex align-items-center justify-content-center rounded-circle"
                          style={{
                            width: "60px",
                            height: "60px",
                            backgroundColor: "#e6f4ea",
                            color: "#16a34a",
                            fontSize: "30px",
                          }}
                        >
                          ✓
                        </span>
                      </div>
                      <h4 className="fw-bold mb-2">Congratulations!</h4>
                      <p className="text-muted mb-3">
                        You cleared the aptitude test and are now eligible for the next
                        round.
                      </p>
                      <p className="fw-semibold mb-4">
                        Score: {correctCount} / {totalQuestions} ({percentage}% )
                      </p>
                      <button
                        type="button"
                        className="btn btn-primary px-4"
                        onClick={() => {
                          setShowCongrats(false);
                          navigate("/candidate/dashboard");
                        }}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AptitudeTest;
