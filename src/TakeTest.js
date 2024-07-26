import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './custom.css'; // Import custom CSS for additional styling

function TakeTest() {
  const location = useLocation();
  const navigate = useNavigate();
  const [testId, setTestId] = useState(null);
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);

  const TIMER_KEY = `test_timer_${testId}`;
  const DURATION_KEY = `test_duration_${testId}`;
  const ANSWERS_KEY = `test_answers_${testId}`;

  useEffect(() => {
    if (location.state && location.state.testId) {
      setTestId(location.state.testId);
    } else {
      alert('No test ID provided. Redirecting to home page.');
      navigate('/');
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (testId) {
      const fetchTest = async () => {
        try {
          const response = await axios.get(`http://localhost:8085/tests/${testId}`);
          setTest(response.data);
          
          // Initialize answers from local storage or with null values
          const storedAnswers = JSON.parse(localStorage.getItem(ANSWERS_KEY));
          setAnswers(storedAnswers || Array(response.data.questions.length).fill(null));

          // Fetch duration from the response
          const duration = response.data.duration * 60; // Convert minutes to seconds
          localStorage.setItem(DURATION_KEY, duration);

          // Start timer
          startTimer(duration);
        } catch (error) {
          console.error('There was an error fetching the test data!', error);
        }
      };
      fetchTest();
    }
  }, [testId]);

  const startTimer = (duration) => {
    const startTime = parseInt(localStorage.getItem(TIMER_KEY) || Date.now());
    localStorage.setItem(TIMER_KEY, startTime);
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remainingTime = duration - elapsed;
    setTimeLeft(remainingTime > 0 ? remainingTime : 0);
  };

  useEffect(() => {
    if (timeLeft !== null) {
      const timerId = setInterval(() => {
        const startTime = parseInt(localStorage.getItem(TIMER_KEY));
        const duration = parseInt(localStorage.getItem(DURATION_KEY));
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const remainingTime = duration - elapsedTime;
        if (remainingTime <= 0) {
          clearInterval(timerId);
          handleSubmit();
        } else {
          setTimeLeft(remainingTime);
        }
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [timeLeft]);

  const handleOptionChange = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(newAnswers));
  };

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    let calculatedScore = 0;
    test.questions.forEach((question, index) => {
      if (answers[index] === question.correctOption) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
    localStorage.removeItem(TIMER_KEY); // Clear timer data after submitting
    localStorage.removeItem(DURATION_KEY); // Clear duration data after submitting
    localStorage.removeItem(ANSWERS_KEY); // Clear answers data after submitting
    alert(`Your score is: ${calculatedScore}`);
    navigate('/');
  };

  if (!test || timeLeft === null) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">{test.testName}</h2>
      <div className="alert alert-info text-center">
        Time left: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
      </div>
      <form onSubmit={handleSubmit}>
        {test.questions.map((question, qIndex) => (
          <div key={qIndex} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Question {qIndex + 1}</h5>
              <div>{question.questionText}</div>
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="form-check">
                  <input
                    type="radio"
                    id={`question-${qIndex}-option-${oIndex}`}
                    name={`question-${qIndex}`}
                    value={oIndex}
                    className="form-check-input"
                    checked={answers[qIndex] === oIndex}
                    onChange={() => handleOptionChange(qIndex, oIndex)}
                  />
                  <label className="form-check-label" htmlFor={`question-${qIndex}-option-${oIndex}`}>
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" className="btn btn-success">Submit Test</button>
      </form>
    </div>
  );
}

export default TakeTest;
