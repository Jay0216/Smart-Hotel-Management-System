import React from "react";
import './HomeBackground.css';

const HeadingText: React.FC = () => {
  return(
    <div className="heading-text">
      <h1>
        <span>SmartStay</span>: Book, Checkin, Enjoy
      </h1>
      <button>Discover</button>
    </div>
  );
};

export default HeadingText;
