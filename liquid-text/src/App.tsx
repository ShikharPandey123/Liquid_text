import React, { useState } from "react";
import { useGesture } from "@use-gesture/react";
import { animated, useSpring } from "react-spring";
import './index.css';


const App: React.FC = () => {
  const [scale, setScale] = useState(1);
  const [isOverlap, setIsOverlap] = useState(false);

  // Spring animations
  const { lineHeight } = useSpring({
    lineHeight: isOverlap ? "0.5em" : `${scale}em`,
    config: { tension: 200, friction: 20 },
  });
  const bind = useGesture({
    onPinch: ({ offset: [distance] }) => setScale(Math.max(0.5, Math.min(3, 1 + distance / 200))),
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 to-pink-500 p-16">
      {/* Buttons */}
      <div className="flex gap-8 mb-8">
        <button
          className="px-8 py-3 bg-gradient-to-r from-purple-700 to-red-600 text-white rounded-full shadow-xl hover:scale-110 transition-transform"
          onClick={() => setIsOverlap(prev => !prev)}
        >
          {isOverlap ? "Disable Overlap" : "✨ Enable Overlap ✨"}
        </button>
        <button
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-400 text-white rounded-full shadow-lg hover:scale-105 transition-transform"
          onClick={() => { setScale(1); setIsOverlap(false); }}
        >
          Reset
        </button>
      </div>

      {/* Scalable Content */}
      <div
        {...bind()}
        className="w-full max-w-3xl bg-white shadow-xl rounded-xl p-8 overflow-y-scroll text-center border border-gray-300 relative"
        style={{ height: "70vh" }}
      >
        <animated.div style={{ lineHeight }} className="text-gray-700 text-lg leading-relaxed space-y-4 text-center">
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i}>Line {i + 1}: This is an example of dynamically adjustable text.</p>
          ))}
        </animated.div>
      </div>
    </div>
  );
};

export default App;
