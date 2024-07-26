import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PopUp from './PopUp'; // Import the PopUp component
import './CreateTest.css'; // Import CSS for the CreateTest page

function CreateTest() {
  const [testName, setTestName] = useState('');
  const [duration, setDuration] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', ''], correctOption: 0 }]);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const handleQuestionChange = (index, event) => {


    const { name, value } = event.target;
    const newQuestions = [...questions];
    newQuestions[index][name] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, event) => {
    const { value } = event.target;
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const addOption = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].options.push('');
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', ''], correctOption: 0 }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8085/tests', {
        testName,
        duration,
        questions
      });
      alert('Test created successfully!');
      navigate('/take-test', { state: { testId: response.data.id } });
    } catch (error) {
      console.error('There was an error creating the test!', error);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  return (
    <div className="create-test-container">
      <h2>Create Test</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Test Name:</label>
          <input
            type="text"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Duration (minutes):</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="form-control"
          />
        </div>
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="form-group">
            <h3>Question {qIndex + 1}</h3>
            <label>Question:</label>
            <input
              type="text"
              name="question"
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, e)}
              className="form-control"
            />
            <div className="options-container">
              <label>Options:</label>
              {q.options.map((option, oIndex) => (
                <div key={oIndex} className="option-group">
                  <label>{`Option ${oIndex + 1}:`}</label>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                    className="form-control"
                  />
                  {oIndex === q.correctOption && <span> (Correct Option)</span>}
                  <button type="button" onClick={() => removeOption(qIndex, oIndex)} className="btn btn-danger btn-sm">
                    Remove Option
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addOption(qIndex)} className="btn btn-primary btn-sm">
                Add Option
              </button>
            </div>
            <div className="form-group">
              <label>Correct Option:</label>
              <select
                value={q.correctOption}
                onChange={(e) => handleQuestionChange(qIndex, { target: { name: 'correctOption', value: parseInt(e.target.value) } })}
                className="form-control"
              >
                {q.options.map((_, index) => (
                  <option key={index} value={index}>{`Option ${index + 1}`}</option>
                ))}
              </select>
            </div>
            <button type="button" onClick={() => removeQuestion(qIndex)} className="btn btn-danger">
              Remove Question
            </button>
          </div>
        ))}
        <button type="button" onClick={addQuestion} className="btn btn-secondary">
          Add Question
        </button>
        <button type="submit" className="btn btn-primary">
          Submit Test
        </button>
        <button type="button" onClick={handlePreview} className="btn btn-secondary">
          Preview Test
        </button>
      </form>

      <PopUp show={showPreview} onClose={() => setShowPreview(false)}>
        <h2>Test Preview</h2>
        <div>
          <strong>Test Name:</strong> {testName}
        </div>
        <div>
          <strong>Duration:</strong> {duration} minutes
        </div>
        {questions.map((q, qIndex) => (
          <div key={qIndex}>
            <h3>Question {qIndex + 1}</h3>
            <div>{q.question}</div>
            <div>
              <strong>Options:</strong>
              <ul>
                {q.options.map((option, oIndex) => (
                  <li key={oIndex}>{option} {oIndex === q.correctOption && <strong>(Correct Option)</strong>}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </PopUp>
    </div>
  );
}

export default CreateTest;
