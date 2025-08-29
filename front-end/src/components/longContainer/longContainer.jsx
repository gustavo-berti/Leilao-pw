import React from 'react';
import './longContainer.scss';

const LongContainer = ({ children }) => {
  return (
    <div className="long-container">
      {children}
    </div>);
};

export default LongContainer;