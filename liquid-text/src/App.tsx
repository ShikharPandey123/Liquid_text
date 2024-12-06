import React, { useState } from "react";
import { useGesture } from "@use-gesture/react";
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
    onPinch: ({ offset }: { offset: [number, number] }) => { // Corrected offset type
      const distance = offset[0]; // You can use either X or Y, typically X is fine
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex gap-4 mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-500 transition"
          onClick={() => setIsOverlap(!isOverlap)}
        >
          {isOverlap ? "Disable Overlap" : "Enable Overlap"}
        </button>

        <button
          className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-500 transition"
          onClick={resetSpacing}
        >
          Reset
        </button>
      </div>

      <div
        {...bind()}
        className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 overflow-y-scroll text-center border border-gray-300 relative"
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

      <div className="text-gray-500 mt-4 text-sm">
        Use a two-finger pinch gesture to adjust line spacing.
      </div>
    </div>
  );
};

export default App;
