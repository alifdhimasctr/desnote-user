"use client";
import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import { Flowbite } from "flowbite-react";
import Header from "../header/header";
import axios from "axios";
import { useCookies } from "react-cookie";
import Link from "next/link";

import { BsClockFill } from "react-icons/bs";
import { HiBuildingOffice2 } from "react-icons/hi2";

export default function page() {

  function formatDate(dateString) {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
  
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  
    const date = new Date(dateString);
    const day = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
  
    return `${day}, ${dayOfMonth} ${month} ${year}`;
  }

  const todayDate = new Date().toISOString().split("T")[0];
  const tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  console.log(todayDate);
  console.log(tomorrowDate);

  const token = useCookies(["token"]);
  const [user, setUser] = useCookies(["user"]);
  const data = user["user"];

  const [todayMeetData, setTodayMeetData] = useState([]);
  const [upcomingMeetData, setUpcomingMeetData] = useState([]);
  const [finishedMeetData, setFinishedMeetData] = useState([]);
  const [allMeetData, setAllMeetData] = useState([]);
  const [ongoingMeetData, setOngoingMeetData] = useState([]);
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
          `/meet/findAllMeet?sort=asc&sortBy=meetDate&page=1&limit=1000&startDate=&endDate=`,
        {
          headers: {
            Authorization: `Bearer ${token[0].token}`,
          },
        }
      );
      console.log(response.data);
      const filteredData = response.data.data.filter(meet => meet.status_code === 2);
      setFinishedMeetData(filteredData);
      setLoading(false);
    };

    const fetchAllMeet = async () => { 
      setLoading(true);
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL +
          `/meet/findAllMeet?sort=asc&sortBy=meetDate&page=1&limit=1000&startDate=&endDate=`,
        {
          headers: {
            Authorization: `Bearer ${token[0].token}`,
          },
        }
      );
      console.log(response.data);
      setAllMeetData(response.data.data);
      setLoading(false);
    };

    const fetchongoingMeet = async () => { 
      setLoading(true);
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL +
          `/meet/findAllMeet?sort=asc&sortBy=meetDate&page=1&limit=1000&startDate=&endDate=`,
        {
          headers: {
            Authorization: `Bearer ${token[0].token}`,
          },
        }
      );
      console.log(response.data);
      const filteredData = response.data.data.filter(meet => meet.status_code === 1);
      setOngoingMeetData(filteredData);
      setLoading(false);
    };

    const fetchUpcomingMeet = async () => {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL +
          `/meet/findAllMeet?sort=asc&sortBy=meetDate&page=1&limit=1000&startDate=&endDate=${todayDate}`,
        {
          headers: {
            Authorization: `Bearer ${token[0].token}`,
          },
        }
      );
      console.log(response.data);
      const filteredData = response.data.data.filter(meet => meet.status_code === 1);
      setUpcomingMeetData(filteredData);
      setLoading(false);
    };

    fetchTodayMeet();
    fetchAllMeet();
    fetchUpcomingMeet();
    fetchFinishedMeet();
    fetchongoingMeet();
  }, []);

  const [showToday, setShowToday] = useState(true);
  const [showOngoing, setShowOngoing] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [showFinished, setShowFinished] = useState(false);

  const handleToday = () => {
    setShowToday(true);
    setShowUpcoming(false);
    setShowOngoing(false);
    setShowFinished(false);
  };

  const handleUpcoming = () => {
    setShowToday(false);
    setShowUpcoming(true);
    setShowOngoing(false);
    setShowFinished(false);
  }

  const handleOngoing = () => {
    setShowToday(false);
    setShowUpcoming(false);
    setShowOngoing(true);
    setShowFinished(false);
  }
    
  const handleFinished = () => {
    setShowToday(false);
    setShowUpcoming(false);
    setShowOngoing(false);
    setShowFinished(true);
  }

  function meetList(){
    if (showToday) {
      if (todayMeetData.length === 0) {
        return <p className="text-left text-gray-600">Tidak ada rapat hari ini</p>;
      }
      return todayMeetData.map((meet) => (
        <Link href={`/meeting/edit?id=${meet.idMeet}`} key={meet.idMeet}>
          <div className="flex flex-col w-full p-2 bg-gray-100 rounded-md gap-1 hover:bg-blue-50">
            <p className="text-md font-semibold">{meet.meetTitle}</p>
            <div className="flex flex-row gap-2 align-middle">
              <BsClockFill className="text-black h-5" />
              <p className="text-sm self-center">{formatDate(meet.meetDate)}</p>
              <p className="text-sm self-center">{new Date(meet.meetDate).toLocaleTimeString()}</p>
            </div>
            <div className="flex flex-row gap-2 align-middle">
              <HiBuildingOffice2 className="text-black h-5" />
              <p className="text-sm self-center">{meet.customerName}</p>
            </div>
          </div>
        </Link>
      ));
    }
    
  
    if (showUpcoming) {
      if (upcomingMeetData.length === 0) {
        return <p className="text-left text-gray-600">Tidak ada rapat mendatang</p>;
      }
      return upcomingMeetData.slice(0, 10).map((meet) => (
        <Link href={`/meeting/edit?id=${meet.idMeet}`} key={meet.idMeet}>
          <div className="flex flex-col w-full p-2 bg-gray-100 rounded-md gap-1 hover:bg-blue-50">
            <p className="text-md font-semibold">{meet.meetTitle}</p>
            <div className="flex flex-row gap-2 align-middle">
              <BsClockFill className="text-black h-5" />
              <p className="text-sm self-center">{formatDate(meet.meetDate)}</p>
              <p className="text-sm self-center">{new Date(meet.meetDate).toLocaleTimeString()}</p>
            </div>
            <div className="flex flex-row gap-2 align-middle">
              <HiBuildingOffice2 className="text-black h-5" />
              <p className="text-sm self-center">{meet.customerName}</p>
            </div>
          </div>
        </Link>
      ));
    }

    if (showOngoing){
      if (ongoingMeetData.length === 0) {
        return <p className="text-left text-gray-600">Tidak ada rapat yang sedang berlangsung</p>;
      }
      return ongoingMeetData.map((meet) => (
        <Link href={`/meeting/edit?id=${meet.idMeet}`} key={meet.idMeet}>
          <div className="flex flex-col w-full p-2 bg-gray-100 rounded-md gap-1 hover:bg-blue-50">
            <p className="text-md font-semibold">{meet.meetTitle}</p>
            <div className="flex flex-row gap-2 align-middle">
              <BsClockFill className="text-black h-5" />
              <p className="text-sm self-center">{formatDate(meet.meetDate)}</p>
              <p className="text-sm self-center">{new Date(meet.meetDate).toLocaleTimeString()}</p>
            </div>
            <div className="flex flex-row gap-2 align-middle">
              <HiBuildingOffice2 className="text-black h-5" />
              <p className="text-sm self-center">{meet.customerName}</p>
            </div>
          </div>
        </Link>
      ));
    }
  
    if (showFinished) {
      if (finishedMeetData.length === 0) {
        return <p className="text-left text-gray-600">Tidak ada rapat yang telah selesai</p>;
      }
      return finishedMeetData.map((meet) => (
        <Link href={`/meeting/edit?id=${meet.idMeet}`} key={meet.idMeet}>
          <div className="flex flex-col w-full p-2 bg-gray-100 rounded-md gap-1 hover:bg-blue-50">
            <p className="text-md font-semibold">{meet.meetTitle}</p>
            <div className="flex flex-row gap-2 align-middle">
              <BsClockFill className="text-black h-5" />
              <p className="text-sm self-center">{formatDate(meet.meetDate)}</p>
              <p className="text-sm self-center">{new Date(meet.meetDate).toLocaleTimeString()}</p>
            </div>
            <div className="flex flex-row gap-2 align-middle">
              <HiBuildingOffice2 className="text-black h-5" />
              <p className="text-sm self-center">{meet.customerName}</p>
            </div>
          </div>
        </Link>
      ));
    }
  }
  

  

  return (
    <div className="bg-white overflow-auto">
      <Header />
      <div className="w-auto min-h-[100vh] m-6 flex gap-6 ">
        <div className="flex flex-col w-screen gap-2">
          <div className="w-full pt-5 flex h-30 rounded-xl bg-white">
            <div className="flex flex-row overflow-visible justify-between w-full h-28 p-4 px-10 pr-20 rounded-xl bg-blue-200">
              <div className="flex flex-col justify-center">
                <h1 className="text-3xl font-bold">Hi, {data?.name}</h1>
                <a className="text-md hover:underline" href="/meeting/create">
                  Ready to Start Meetings?
                </a>
              </div>
              <div className="flex flex-col items-end justify-end">
                <Image
                  src="/notes2.png"
                  className="self-end"
                  alt="notes"
                  width={120}
                  height={120}
                />
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-1 h-max">
            <p className="text-sm font-bold">Total Meeting</p>
            <div className="flex flex-row gap-2 justify-between">
              <div className="flex flex-col w-1/3 p-4 bg-purple-600 rounded-md">
                <p className="text-2xl font-bold text-white">{allMeetData.length}</p>
                <p className="text-md text-white font-semibold">Total</p>
              </div>
              <div className="flex flex-col w-1/3 p-4 bg-blue-600 rounded-md">
                <p className="text-2xl font-bold text-white">{todayMeetData.length}</p>
                <p className="text-md text-white font-semibold">Today</p>
              </div>
              <div className="flex flex-col w-1/3 p-4 bg-yellow-300 rounded-md">
                <p className="text-2xl font-bold text-white">{upcomingMeetData.length}</p>
                <p className="text-md text-white font-semibold">Upcoming</p>
              </div>
              <div className="flex flex-col w-1/3 p-4 bg-pink-500 rounded-md">
                <p className="text-2xl font-bold text-white">{ongoingMeetData.length}</p>
                <p className="text-md text-white font-semibold">Ongoing</p>
              </div>
              <div className="flex flex-col w-1/3 p-4 bg-green-600 rounded-md">
                <p className="text-2xl font-bold text-white">{finishedMeetData.length}</p>
                <p className="text-md text-white font-semibold">Finished</p>
              </div>
            </div>
          </div>

          <div className="w-1/4 flex flex-row mt-2 border-white rounded-lg ">
            <button onClick={handleToday} className={`w-1/2 p-2 text-black text-sm hover:bg-gray-100  ${showToday? 'text-black border-b-2 border-black'  : ''}`}>Today</button>
            <button onClick={handleUpcoming} className={`w-1/2 p-2 text-black text-sm hover:bg-gray-100 ${showUpcoming? 'text-black border-b-2 border-black'  : ''}`}>Upcoming</button>
            <button onClick={handleOngoing} className={`w-1/2 p-2 text-black text-sm hover:bg-gray-100 ${showOngoing? 'text-black border-b-2 border-black'  : ''}`}>Ongoing</button>
            <button onClick={handleFinished} className={`w-1/2 p-2 text-black text-sm hover:bg-gray-100 ${showFinished? 'text-black border-b-2 border-black'  : ''}`}>Finished</button>
          </div> 
          {loading ? (
            <div className="w-full flex flex-col gap-2 mt-2">
              {[...Array(10)].map((_, index) => (
                <div className="flex flex-col w-full p-2  bg-gray-100 rounded-md gap-1 animate-pulse">
                  <p className="text-md font-semibold">............</p>
                  <div className="flex flex-row gap-2 align-middle">
                    <BsClockFill className="
                    text-black h-5" />
                    <p className="text-sm self-center">............</p>
                    <p className="text-sm self-center">............</p>
                  </div>
                  <div className="flex flex-row gap-2 align-middle">
                    <HiBuildingOffice2 className="text-black h-5" />
                    <p className="text-sm self-center">............</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full flex flex-col gap-2 mt-2">
              {meetList()}
            </div>
          )
            
          }

          


        </div>
      </div>
    </div>
  );
}
