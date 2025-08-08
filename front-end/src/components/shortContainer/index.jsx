import React from 'react';
import './index.scss';

const ShortContainer = ({ children }) => {
  return (
    <div className="container">
      {children}
    </div>);
};

export default ShortContainer;