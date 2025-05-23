import React from "react";

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex items-center justify-center space-x-2">
        <div
          className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
      <p className="ml-2 text-lg font-medium text-indigo-600">Loading...</p>
    </div>
  );
}

export default LoadingSpinner;
