import React from "react";

interface SkeletonProps {
  height?: string | number;
  width?: string | number;
  borderRadius?: string | number;
}

export const SkeletonComponent = ({
  height = 50,
  width = 200,
  borderRadius = 8,
}: SkeletonProps) => {
  return (
    <div className="animate-pulse flex space-x-4">
      <div
        className="bg-gray-300"
        style={{ height: height, width: width, borderRadius: borderRadius }}
      ></div>
    </div>
  );
};
