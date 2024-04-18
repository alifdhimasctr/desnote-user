"use client";
import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import { Flowbite } from "flowbite-react";
import Header from "../header/header";
import axios from "axios";
import { useCookies } from "react-cookie";
import Link from "next/link";

export default function page() {
  const todayDate = new Date().toISOString().split("T")[0];
  const tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  console.log(todayDate);
  console.log(tomorrowDate);

  const token = useCookies(["token"]);
  const [todayMeetData, setTodayMeetData] = useState([]);
  const [upcomingMeetData, setUpcomingMeetData] = useState([]);
  const [finishedMeetData, setFinishedMeetData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayMeet = async () => {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL +
          `/meet/findAllMeet?sort=desc&sortBy=meetDate&page=1&limit=1000&startDate=${todayDate}&endDate=${tomorrowDate}`,
        {
          headers: {
            Authorization: `Bearer ${token[0].token}`,
          },
        }
      );
      console.log(response.data);
      setTodayMeetData(response.data.data);
      setLoading(false);
    };

    const fetchFinishedMeet = async () => {
      setLoading(true);
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL +
          `/meet/findAllMeet?sort=asc&sortBy=meetDate&page=1&limit=1000&startDate=${tomorrowDate}&endDate=`,
        {
          headers: {
            Authorization: `Bearer ${token[0].token}`,
          },
        }
      );
      console.log(response.data);
      setFinishedMeetData(response.data.data);
      setLoading(false);
    };

    const fetchUpcomingMeet = async () => {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL +
          `/meet/findAllMeet?sort=desc&sortBy=meetDate&page=1&limit=1000&startDate=&endDate=${todayDate}`,
        {
          headers: {
            Authorization: `Bearer ${token[0].token}`,
          },
        }
      );
      console.log(response.data);
      setUpcomingMeetData(response.data.data);
      setLoading(false);
    };

    fetchTodayMeet();
    fetchUpcomingMeet();
    fetchFinishedMeet();
  }, []);

  return (
    <div className="bg-gray-200 overflow-auto">
      <Header />
      <div className="w-auto min-h-[100vh] m-6 flex gap-6 ">
        <div className="flex flex-col w-screen gap-6">
          {loading ? (
            <div className="animate-pulse">
              <div className=" flex h-max min-w-60 p-4 flex-col gap-3 bg-white rounded-lg shadow-lg">
                <div className="flex align-center justify-between">
                  <a className="font-semibold text-left">Total Meeting</a>
                </div>

                <div className="flex flex-row gap-4">
                <div className="flex w-full bg-blue-200 justify-between align-middle rounded-lg p-2">
                  <a className="font-semibold text-xl self-center">Today</a>
                  <div className="text-3xl font-bold text-black">...</div>
                </div>

                <div className="flex w-full bg-yellow-200 justify-between align-middle rounded-lg p-2">
                  <a className="font-semibold text-xl self-center">Upcoming</a>
                  <div className="text-3xl font-bold text-black">...</div>
                </div>

                <div className="flex w-full bg-green-200 justify-between align-middle rounded-lg p-2">
                  <a className="font-semibold text-xl self-center">Finish</a>
                  <div className="text-3xl font-bold text-black">...</div>
                </div>
                </div>

                
              </div>
            </div>
          ) : (
            <div className=" flex h-max min-w-60 p-4 flex-col bg-white rounded-lg shadow-lg">
                <div className="flex align-center justify-between">
                  <a className="font-semibold text-left">Total Meeting</a>
                </div>

                <div className="flex flex-row gap-4">
                <div className="flex w-full bg-blue-200 justify-between align-middle rounded-lg p-2">
                  <a className="font-semibold text-xl self-center">Today</a>
                  <div className="text-3xl font-bold text-black">{todayMeetData.length}</div>
                </div>

                <div className="flex w-full bg-yellow-200 justify-between align-middle rounded-lg p-2">
                  <a className="font-semibold text-xl self-center">Upcoming</a>
                  <div className="text-3xl font-bold text-black">{upcomingMeetData.length}</div>
                </div>

                <div className="flex w-full bg-green-200 justify-between align-middle rounded-lg p-2">
                  <a className="font-semibold text-xl self-center">Finish</a>
                  <div className="text-3xl font-bold text-black">{finishedMeetData.length}</div>
                </div>
                </div>

                
              </div>
          )}

          <div className="h-max min-w-96 w-full p-4 flex-col gap-4 bg-white rounded-lg shadow-lg">
            <div className="flex align-center justify-between">
              <a className="font-semibold text-left">Today's Meet</a>
            </div>

            {loading ? (
              <div>
                <div className="flex animate-pulse flex-col bg-gray-100 rounded-lg p-2 gap-2 my-2">
                  <div class="h-5 w-1/4 bg-gray-300 rounded"></div>
                  <div class="h-4 w-1/12 bg-gray-300 rounded"></div>
                </div>

                <div className="flex animate-pulse flex-col bg-gray-100 rounded-lg p-2 gap-2 my-2">
                  <div class="h-5 w-1/4 bg-gray-300 rounded"></div>
                  <div class="h-4 w-1/12 bg-gray-300 rounded"></div>
                </div>

                <div className="flex animate-pulse flex-col bg-gray-100 rounded-lg p-2 gap-2 my-2">
                  <div class="h-5 w-1/4 bg-gray-300 rounded"></div>
                  <div class="h-4 w-1/12 bg-gray-300 rounded"></div>
                </div>
              </div>
            ) : null}

            {todayMeetData.map((meet) => (
              <Link href={`/meeting/edit?id=${meet.idMeet}`}>
                <div className="flex-col bg-gray-100 rounded-lg p-1 my-2 hover:bg-gray-200">
                  <a className="font-semibold">{meet.meetTitle}</a>
                  <div className="text-[0.75rem] text-gray-500">
                    {new Date(meet.meetDate).toString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex max-w-screen gap-4">
            <div className="h-max min-w-96 w-1/2 p-4 flex-col gap-4 bg-white rounded-lg shadow-lg">
              <div className="flex align-center justify-between">
                <a className="font-semibold text-left">Upcoming Meet</a>
              </div>

              {loading ? (
                <div>
                  <div className="flex animate-pulse flex-col bg-gray-100 rounded-lg p-2 gap-2 my-2">
                    <div class="h-5 w-1/4 bg-gray-300 rounded"></div>
                    <div class="h-4 w-1/12 bg-gray-300 rounded"></div>
                  </div>

                  <div className="flex animate-pulse flex-col bg-gray-100 rounded-lg p-2 gap-2 my-2">
                    <div class="h-5 w-1/4 bg-gray-300 rounded"></div>
                    <div class="h-4 w-1/12 bg-gray-300 rounded"></div>
                  </div>

                  <div className="flex animate-pulse flex-col bg-gray-100 rounded-lg p-2 gap-2 my-2">
                    <div class="h-5 w-1/4 bg-gray-300 rounded"></div>
                    <div class="h-4 w-1/12 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ) : null}

              {upcomingMeetData.slice(0, 10).map((meet) => (
                <Link href={`/meeting/edit?id=${meet.idMeet}`}>
                  <div className="flex-col bg-gray-100 rounded-lg p-2 my-2 hover:bg-gray-200">
                    <a className="font-semibold">{meet.meetTitle}</a>
                    <div className="text-[0.75rem] mt-1 text-gray-500">
                      {new Date(meet.meetDate).toString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="h-max min-w-96 w-1/2 p-4 flex-col gap-4 bg-white rounded-lg shadow-lg">
              <div className="flex align-center justify-between">
                <a className="font-semibold text-left">Finish Meet</a>
              </div>

              {loading ? (
                <div>
                  <div className="flex animate-pulse flex-col bg-gray-100 rounded-lg p-2 gap-2 my-2">
                    <div class="h-5 w-1/4 bg-gray-300 rounded"></div>
                    <div class="h-4 w-1/12 bg-gray-300 rounded"></div>
                  </div>

                  <div className="flex animate-pulse flex-col bg-gray-100 rounded-lg p-2 gap-2 my-2">
                    <div class="h-5 w-1/4 bg-gray-300 rounded"></div>
                    <div class="h-4 w-1/12 bg-gray-300 rounded"></div>
                  </div>

                  <div className="flex animate-pulse flex-col bg-gray-100 rounded-lg p-2 gap-2 my-2">
                    <div class="h-5 w-1/4 bg-gray-300 rounded"></div>
                    <div class="h-4 w-1/12 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ) : null}

              {finishedMeetData.slice(0, 10).map((meet) => (
                <Link href={`/meeting/edit?id=${meet.idMeet}`}>
                  <div className="flex-col bg-gray-100 rounded-lg p-2 my-2 hover:bg-gray-200">
                    <a className="font-semibold">{meet.meetTitle}</a>
                    <div className="text-[0.75rem] mt-1 text-gray-500">
                      {new Date(meet.meetDate).toString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
