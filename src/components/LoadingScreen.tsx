import React from "react";
import { LoadingIcon } from "./LoadingIcon";

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>

      <LoadingIcon size={60} color="text-white" />
    </div>
  );
};
