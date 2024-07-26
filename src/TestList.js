import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TestList() {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get('http://localhost:8080/tests');
        setTests(response.data);

      } catch (error) {
        console.error('There was an error fetching the tests!', error);
      }
    };
    fetchTests();
  }, []);

  return (
    <div>
      <h2>Test List</h2>
      <ul>
        {tests.map((test) => (
          <li key={test.id}>
            <h3>{test.testName}</h3>
            <ul>
              {test.questions.map((q, index) => (
                <li key={index}>
                  <strong>Q{index + 1}: </strong>{q.question}
                  <br />
                  <strong>Answer: </strong>{q.answer}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TestList;
