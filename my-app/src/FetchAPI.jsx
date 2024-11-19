import { useState, useEffect } from "react";
import "./assets/AssessmentForm.css";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import PropTypes from 'prop-types'; // Import PropTypes

// Register chart elements
Chart.register(ArcElement, Tooltip, Legend);

const AssessmentForm = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userScore, setUserScore] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("https://assesment-server-umber.vercel.app/risk-questions");
        const data = await response.json();
        setQuestions(data.data); // Assuming the API response has questions in `data.data`
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  // Handle answer selection
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Navigate to the next question
  const handleNext = () => {
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  // Navigate to the previous question
  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  // Calculate user score
  const calculateScore = () => {
    let score = 0;
    questions.forEach((question) => {
      const selectedOption = question.options.find(
        (option) => option.value === answers[question.id]
      );
      if (selectedOption) {
        score += selectedOption.score; // Add the score of the selected option
      }
    });
    return score;
  };

  // Send user score to the server
  const sendScore = async (score) => {
    try {
      const response = await fetch("https://assesment-server-umber.vercel.app/calculate-risk-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userScore: score }),
      });
      await response.json();
    } catch (error) {
      console.error("Error sending user score:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const score = calculateScore();
    setUserScore(score);
    await sendScore(score);
    setIsSubmitted(true);
  };

  // Doughnut chart to show the score and risk profile
  const RiskProfileChart = ({ score }) => {
    const percentage = Math.round((score / (questions.length * 5)) * 100);

    const chartData = {
      datasets: [
        {
          data: [percentage, 100 - percentage],
          backgroundColor: ["#FF6B6B", "#F1F1F1"],
          borderWidth: 0,
          hoverOffset: 4,
          cutout: "80%",
          rotation: 225,
          circumference: 270,
        },
      ],
    };

    const riskProfile =
      percentage <= 33
        ? "Conservative"
        : percentage <= 66
        ? "Balanced"
        : "Aggressive";

    return (
      <div style={{ width: "300px", margin: "0 auto", textAlign: "center" }}>
        <Doughnut data={chartData} options={{ plugins: { tooltip: false } }} />
        <div
          style={{
            position: "relative",
            top: "-150px",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          {percentage}%
        </div>
        <div style={{ fontSize: "16px" }}>{riskProfile}</div>
        <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
          {riskProfile === "Conservative"
            ? "You are a Conservative investor. Risk should be low, and you are prepared to accept lower returns to protect capital."
            : riskProfile === "Balanced"
            ? "You are a Balanced investor. You accept moderate risks for potentially better returns."
            : "You are an Aggressive investor. You are willing to take significant risks for high returns."}
        </p>
      </div>
    );
  };

  // Prop validation for RiskProfileChart
  RiskProfileChart.propTypes = {
    score: PropTypes.number.isRequired, // Validate that score is a number and required
  };

  if (isSubmitted) {
    return (
      <div className="result-container">
        <h2>Thank you for completing the assessment!</h2>
        <h2>Your Score: {userScore}</h2>
        <RiskProfileChart score={userScore} />
      </div>
    );
  }

  return (
    <div className="form-container">
      {questions.length > 0 ? (
        <form onSubmit={handleSubmit}>
          <div className="question-card">
            <button
              type="button"
              className="back-button"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Back
            </button>
            <p className="question-number" style={{ color: "black" }}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
            <h2 className="question-title" style={{ color: "black" }}>
              {questions[currentQuestionIndex].question}
            </h2>
            <div className="options" style={{ color: "black" }}>
              {questions[currentQuestionIndex].options.map((option, index) => (
                <label key={index} className="option">
                  <input
                    type="radio"
                    name={`question-${questions[currentQuestionIndex].id}`}
                    value={option.value}
                    checked={
                      answers[questions[currentQuestionIndex].id] === option.value
                    }
                    onChange={() =>
                      handleAnswerChange(questions[currentQuestionIndex].id, option.value)
                    }
                  />
                  {option.value}
                </label>
              ))}
            </div>
          </div>
          <div className="navigation">
            <button
              type="button"
              className="next-button"
              onClick={handleNext}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Next
            </button>
            {currentQuestionIndex === questions.length - 1 && (
              <button type="submit" className="submit-button">
                Submit
              </button>
            )}
          </div>
        </form>
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
};

export default AssessmentForm;
