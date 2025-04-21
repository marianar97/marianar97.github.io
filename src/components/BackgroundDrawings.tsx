
import React from "react";

// Use uploaded images as low opacity, positioned tech-drawings in the background
const BackgroundDrawings = () => {
  return (
    <div className="bg-drawings">
      {/* First image: top right, slightly rotated */}
      <img
        src="/lovable-uploads/3185a2b2-7c99-4dd9-9831-cb09462728fa.png"
        alt="Technical Drawing 1"
        className="bg-drawings__img"
        style={{
          top: "1vw",
          right: "-10vw",
          width: "42vw",
          transform: "rotate(7deg)",
          zIndex: 1,
        }}
        draggable={false}
        aria-hidden
      />
      {/* Second image: bottom left, less rotated, larger */}
      <img
        src="/lovable-uploads/f67cd0c0-9325-4c04-96ae-08028c22e56d.png"
        alt="Technical Drawing 2"
        className="bg-drawings__img"
        style={{
          left: "-12vw",
          bottom: "-7vw",
          width: "55vw",
          transform: "rotate(-8deg)",
          zIndex: 1,
        }}
        draggable={false}
        aria-hidden
      />
    </div>
  );
};

export default BackgroundDrawings;
