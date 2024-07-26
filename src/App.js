// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateTest from './CreateTest';
import PreviewPage from './PreviewPage';
import TakeTest from './TakeTest';
import TestList from './TestList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateTest />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/take-test" element={<TakeTest />} />
        <Route path="/test-list" element={<TestList />}/>
      </Routes>
    </Router>
  );
}

export default App;
