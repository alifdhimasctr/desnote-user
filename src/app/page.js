import React from "react";

export default function page() {
  return (
    <div className=" w-screen h-screen flex content-center items-center justify-center bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600">
      <div className="flex flex-row w-3/4 h-3/4">
      <div className="flex flex-col justify-center items-center w-full h-full">
          <h1 className="text-4xl font-bold text-white">Welcome to DesNote</h1>
          <p className="text-lg text-white">Aplikasi Notulensi</p>
          <a href="/login" className="bg-white hover:bg-blue-400  text-black hover:text-white font-bold py-2 px-20 rounded focus:outline-none focus:shadow-outline mt-4">Login</a>
        </div>
      </div>

        

    </div>
  );
}
