import React from "react";
import landingImage from "../assets/marten-bjork-n_IKQDCyrG0-unsplash.jpg";
import HeadingText from "./HeadingText";

const HomeBackground: React.FC = () => {
  return (
    <div
      className="w-full h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: `url(${landingImage})`,
      }}
    >

      <HeadingText/>
    
    </div>
  );
};

export default HomeBackground;