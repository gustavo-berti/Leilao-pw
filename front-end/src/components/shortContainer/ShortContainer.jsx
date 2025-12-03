import React from 'react';
import './ShortContainer.scss';

const ShortContainer = ({ children }) => {
  return (
    <div className="container">
      {children}
    </div>);
};

export default ShortContainer;