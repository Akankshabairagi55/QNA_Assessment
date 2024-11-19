
import  { useState, useEffect } from "react";
import "./assets/AssessmentForm.css";


const AssessmentForm = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    console.log("User Answers:", answers);
    // You can calculate scores or send answers to a server here
  };

  if (isSubmitted) {
    return (
      <div className="result-container">
        <h2>Thank you for completing the assessment!</h2>
        <p>Your responses have been recorded.</p>
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
            <p className="question-number">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
            <h2 className="question-title">
              {questions[currentQuestionIndex].question}
            </h2>
            <div className="options">
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
                      handleAnswerChange(
                        questions[currentQuestionIndex].id,
                        option.value
                      )
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
