import React, { useState } from "react";
import { useGesture } from "@use-gesture/react";
import { animated, useSpring } from "react-spring";
import * as pdfjs from "pdfjs-dist";
import "@react-pdf-viewer/core/lib/styles/index.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const App: React.FC = () => {
  const [scale, setScale] = useState(1);
  const [isOverlap, setIsOverlap] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfContent, setPdfContent] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { lineHeight } = useSpring({
    lineHeight: isOverlap ? "0.5em" : `${scale}em`,
    config: { tension: 200, friction: 20 },
  });

  const bind = useGesture({
    onPinch: ({ offset: [distance] }) => setScale(Math.max(0.5, Math.min(3, 1 + distance / 200))),
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setPdfContent([]);
      setError(null);
    }
  };

  const extractTextFromPage = async (page: any) => {
    const textContent = await page.getTextContent();
    return textContent.items.map((item: any) => item.str).join(" ");
  };

  const renderPdfContent = async (pdf: any) => {
    const extractedContent: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const pageText = await extractTextFromPage(page);
      extractedContent.push(pageText);
    }
    setPdfContent(extractedContent);
  };

  const handlePdfLoad = async () => {
    if (pdfFile) {
      try {
        const fileReader = new FileReader();
        fileReader.onload = async (e) => {
          try {
            const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
            const pdf = await pdfjs.getDocument(typedArray).promise;
            setNumPages(pdf.numPages);
            renderPdfContent(pdf);
          } catch (e) {
            setError("Failed to load PDF. Please try a different file.");
          }
        };
        fileReader.readAsArrayBuffer(pdfFile);
      } catch (e) {
        setError("An error occurred while processing the PDF.");
      }
    } else {
      setError("Please select a PDF file to upload.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500 p-6">
      <div className="flex flex-col items-center bg-white shadow-xl rounded-lg p-8 w-full max-w-3xl space-y-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Liquid Text PDF Viewer</h1>
        <div className="flex items-center gap-4 mb-6">
          <label
            htmlFor="file-upload"
            className="cursor-pointer px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            Upload PDF
          </label>
          <input
            id="file-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            className="px-8 py-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all"
            onClick={handlePdfLoad}
          >
            Load PDF
          </button>
        </div>
        {error && <p className="text-red-500 font-semibold mb-4">{error}</p>}
        {numPages && (
          <p className="text-gray-700 mb-4">
            <strong>Total Pages:</strong> {numPages}
          </p>
        )}
        <div className="flex gap-4 mb-8">
          <button
            className="px-8 py-4 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all"
            onClick={() => setIsOverlap((prev) => !prev)}
          >
            {isOverlap ? "Disable Overlap" : "Enable Overlap"}
          </button>
          <button
            className="px-8 py-4 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 transition-all"
            onClick={() => {
              setScale(1);
              setIsOverlap(false);
            }}
          >
            Reset
          </button>
        </div>
        <div
          {...bind()}
          className="w-full h-[70vh] bg-gray-50 shadow-inner border border-gray-300 rounded-lg overflow-y-auto p-6"
        >
          {pdfContent.length > 0 ? (
            <animated.div
              style={{ lineHeight }}
              className="text-gray-800 text-lg leading-relaxed space-y-6"
            >
              {pdfContent.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </animated.div>
          ) : (
            <p className="text-gray-500">Upload and load a PDF to see its content here.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
