import React from "react";

const Modal = ({ isVisible, onClose , children}) => {
  if (!isVisible) return null;
  const handleClose = (e) => {
    if (e.target.id === 'wrapper' ) onClose();
    
  }
  return (
    <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="flex flex-col bg-gray-100 w-3/4 h-max p-4 rounded-lg shadow-lg">
        <button className="self-end mb-4" onClick={() => onClose()}>X</button>
        <div className="flex flex-col gap-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

