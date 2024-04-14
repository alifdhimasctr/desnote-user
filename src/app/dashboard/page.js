"use client"
import React, {useState, useEffect} from "react";
import Image from "next/image";
import { Flowbite } from "flowbite-react";
import Header from "../header/header";
import axios from "axios";
import { useCookies } from "react-cookie";

export default function page() {
    
    const [token, setToken] = useCookies(["token"]);
    const [user, setUser] = useCookies(["user"]);
    const data = user["user"];

  return (
    <div className="bg-gray-200 overflow-auto">
      <Header />
      <div className="w-auto min-h-[100vh] m-6 flex gap-6 ">
        <div className="flex flex-col w-screen gap-6">
          <div className="flex max-w-screen gap-4">
            <div className="h-max min-w-96 w-1/2 p-4 flex-col gap-4 bg-white rounded-lg shadow-lg">
              <div className="flex align-center justify-between">
                <a className="font-semibold text-left">Last Meet</a>
                <a href="#" className="text-xs text-right text-blue-500">
                  See all
                </a>
              </div>

              <div className="flex-col bg-gray-100 rounded-lg p-2 my-2">
                <a className="font-semibold">Meeting Aplikasi DesNet</a>
                <div className="text-[0.75rem] mt-1 text-gray-500">
                  Monday, 20 September 2021
                </div>
              </div>

              <div className="flex-col bg-gray-100 rounded-lg p-2 my-2">
                <a className="font-semibold">Meeting Aplikasi DesNet</a>
                <div className="text-[0.75rem] mt-1 text-gray-500">
                  Monday, 20 September 2021
                </div>
              </div>

              <div className="flex-col bg-gray-100 rounded-lg p-2 my-2">
                <a className="font-semibold">Meeting Aplikasi DesNet</a>
                <div className="text-[0.75rem] mt-1 text-gray-500">
                  Monday, 20 September 2021
                </div>
              </div>
            </div>

            <div className="h-max min-w-96 w-1/2 p-4 flex-col gap-4 bg-white rounded-lg shadow-lg">
              <div className="flex align-center justify-between">
                <a className="font-semibold text-left">Ongoing Meet</a>
                <a href="#" className="text-xs text-right text-blue-500">
                  See all
                </a>
              </div>

              <div className="flex-col bg-gray-100 rounded-lg p-2 my-2">
                <a className="font-semibold">Meeting Aplikasi DesNet</a>
                <div className="text-[0.75rem] mt-1 text-gray-500">
                  Monday, 20 September 2021
                </div>
              </div>

              <div className="flex-col bg-gray-100 rounded-lg p-2 my-2">
                <a className="font-semibold">Meeting Aplikasi DesNet</a>
                <div className="text-[0.75rem] mt-1 text-gray-500">
                  Monday, 20 September 2021
                </div>
              </div>
            </div>
          </div>

          <div className="flex max-w-screen gap-4">
            <div className="h-max min-w-60 w-1/4 p-4 flex-col gap-4 bg-white rounded-lg shadow-lg">
              <div className="flex align-center justify-between">
                <a className="font-semibold text-left">Total Meeting</a>
                <a href="#" className="text-xs text-right text-blue-500">
                  See all
                </a>
              </div>

              <div className="flex bg-blue-200 justify-between align-middle rounded-lg p-2 my-2">
                <a className="font-semibold text-xl self-center">Already</a>
                <div className="text-3xl font-bold text-black">
                  90
                </div>
              </div>

              <div className="flex bg-yellow-200 justify-between align-middle rounded-lg p-2 my-2">
                <a className="font-semibold text-xl self-center">Ongoing</a>
                <div className="text-3xl font-bold text-black">
                  67
                </div>
              </div>

              <div className="flex bg-green-200 justify-between align-middle rounded-lg p-2 my-2">
                <a className="font-semibold text-xl self-center">Total</a>
                <div className="text-3xl font-bold text-black">
                  157
                </div>
              </div>

            </div>

            <div className="h-max min-w-96 w-3/4 p-4 flex-col gap-4 bg-white rounded-lg shadow-lg">
              <div className="flex align-center justify-between">
                <a className="font-semibold text-left">Notulensi</a>
                <a href="#" className="text-xs text-right text-blue-500">
                  See all
                </a>
              </div>

              <div className="flex-col bg-gray-100 rounded-lg p-2 my-2">
                <a className="font-semibold">Meeting Aplikasi DesNet</a>
                <div className="text-[0.75rem] mt-1 text-gray-500">
                  Monday, 20 September 2021
                </div>
              </div>

              <div className="flex-col bg-gray-100 rounded-lg p-2 my-2">
                <a className="font-semibold">Meeting Aplikasi DesNet</a>
                <div className="text-[0.75rem] mt-1 text-gray-500">
                  Monday, 20 September 2021
                </div>
              </div>

              <div className="flex-col bg-gray-100 rounded-lg p-2 my-2">
                <a className="font-semibold">Meeting Aplikasi DesNet</a>
                <div className="text-[0.75rem] mt-1 text-gray-500">
                  Monday, 20 September 2021
                </div>
              </div>

              <div className="flex-col bg-gray-100 rounded-lg p-2 my-2">
                <a className="font-semibold">Meeting Aplikasi DesNet</a>
                <div className="text-[0.75rem] mt-1 text-gray-500">
                  Monday, 20 September 2021
                </div>
              </div>

              <div className="flex-col bg-gray-100 rounded-lg p-2 my-2">
                <a className="font-semibold">Meeting Aplikasi DesNet</a>
                <div className="text-[0.75rem] mt-1 text-gray-500">
                  Monday, 20 September 2021
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
