import React, { useState } from "react";
import { useGesture } from "@use-gesture/react"; // Correct import
import { animated, useSpring } from "react-spring";

const App: React.FC = () => {
  const [scale, setScale] = useState<number>(1);
  const [isOverlap, setIsOverlap] = useState<boolean>(false);

  // Spring animation for smooth scaling
  const { lineHeight } = useSpring({
    lineHeight: isOverlap ? "0.5em" : `${scale}em`,
    config: { tension: 200, friction: 20 },
  });

  // Spring animation for progress indicator
  const progressSpring = useSpring({
    width: `${(scale / 3) * 100}%`,
    config: { tension: 180, friction: 12 },
  });

  // Handle pinch gesture using `useGesture`
  const bind = useGesture({
    onPinch: ({ offset: [distance, _] }: { offset: [number, number] }) => {
      const newScale = Math.max(0.5, Math.min(3, 1 + distance / 200));
      setScale(newScale);
    },
  });

  // Reset functionality
  const resetSpacing = (): void => {
    setScale(1);
    setIsOverlap(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 p-8">
      <div className="flex gap-6 mb-8">
        <button
          className="px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white rounded-full shadow-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
          onClick={() => setIsOverlap(!isOverlap)}
        >
          {isOverlap ? "Disable Overlap" : "Enable Overlap"}
        </button>

        <button
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full shadow-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50"
          onClick={resetSpacing}
        >
          Reset
        </button>
      </div>

      <div
        {...bind()}
        className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8 overflow-y-scroll text-center border border-gray-300 relative"
        style={{ height: "70vh" }}
      >
        <animated.div
          style={{ lineHeight }}
          className="text-gray-800 text-lg leading-relaxed space-y-4"
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i} className="text-base">
              Line {i + 1}: This is an example of dynamically adjustable text.
            </p>
          ))}
        </animated.div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-200 rounded-full">
          <animated.div
            style={progressSpring}
            className="h-full bg-blue-600 rounded-full"
          ></animated.div>
        </div>
      </div>

      <div className="text-white mt-4 text-sm">
        Use a two-finger pinch gesture to adjust line spacing.
      </div>
    </div>
  );
};

export default App;
