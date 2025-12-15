import React from "react";
import landingImage from "../assets/marten-bjork-n_IKQDCyrG0-unsplash.jpg";
import HeadingText from "./HeadingText";
import './HomeBackground.css';

const HomeBackground: React.FC = () => {
  return (
    <div
      className="home-background"
      style={{
        backgroundImage: `url(${landingImage})`,
      }}
    >
      <HeadingText />
    </div>
  );
};

export default HomeBackground;
