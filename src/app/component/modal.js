import React from "react";
import { MdClose } from "react-icons/md";

const Modal = ({ isVisible, onClose , children}) => {
  if (!isVisible) return null;
  const handleClose = (e) => {
    if (e.target.id === 'wrapper' ) onClose();
    
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="flex flex-col bg-white w-3/4 max-h-[30rem] overflow-auto p-4 rounded-lg shadow-lg">
        <button className="self-end mb-4" onClick={() => onClose()}> <MdClose className="h-5 w-5"/> </button>
        <div className="flex flex-col gap-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

