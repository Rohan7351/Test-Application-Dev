// PreviewPage.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './custom.css'; // Import custom CSS for additional styling

function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { testName, duration, questions } = location.state;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Test Preview</h2>
      <div className="card mb-3">
        <div className="card-body">
          <div className="mb-3">
            <strong>Test Name:</strong> {testName}
          </div>
          <div className="mb-3">
            <strong>Duration:</strong> {duration} minutes
          </div>
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="mb-3">
              <h5>Question {qIndex + 1}</h5>
              <div>{q.question}</div>
              <div>
                <strong>Options:</strong>
                <ul className="list-group">
                  {q.options.map((option, oIndex) => (
                    <li key={oIndex} className={`list-group-item ${oIndex === q.correctOption ? 'list-group-item-success' : ''}`}>
                      {option} {oIndex === q.correctOption && <strong>(Correct Option)</strong>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>Close Preview</button>
        </div>
      </div>
    </div>
  );
}

export default PreviewPage;
