// PopUp.js
import React from 'react';
import './PopUp.css'; // Import CSS for styling

function PopUp({ show, onClose, children }) {
  if (!show) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}

export default PopUp;
