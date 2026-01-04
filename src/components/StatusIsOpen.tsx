import React from "react";

export const StatusIsOpen = ({ storeOpen }: { storeOpen: boolean }) => {
  return (
    <div className="flex items-center justify-center">
      {storeOpen ? (
        <>
          <div className="bg-green-400 h-2.5 w-2.5 rounded-full mr-2"></div>
          <span className="text-md">Aberto</span>
        </>
      ) : (
        <>
          <div className="bg-red-600 h-2.5 w-2.5 rounded-full mr-2"></div>
          <span className="text-md">Fechado</span>
        </>
      )}
    </div>
  );
};
