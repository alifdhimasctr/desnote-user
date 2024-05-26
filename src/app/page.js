import React from "react";

export default function page() {
  return (
    <div className=" w-screen h-screen flex content-center items-center justify-center bg-blue-200">
      <div className="flex flex-row w-3/4 h-3/4 bg-white">
      <div className="flex flex-col justify-center items-center w-full h-full">
          <h1 className="text-4xl font-bold">Welcome to DesNote</h1>
          <p className="text-lg">Aplikasi Notulensi</p>
        </div>
        <img src="welcome2.svg" alt="404" className="w-full h-full" />
      </div>

        

    </div>
  );
}
