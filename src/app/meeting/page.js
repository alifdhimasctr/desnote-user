"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Flowbite } from "flowbite-react";
import Header from "../header/header";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCookies } from "react-cookie";
import { FiEdit } from "react-icons/fi";
import { MdAssignmentAdd } from "react-icons/md";

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

export default function Meet() {
  const [meetData, setMeetData] = useState([]);
  const router = useRouter();
  const token = useCookies(["token"]);
  const data = useCookies(["user"]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const handleEdit = (id) => {
    router.push(`/meeting/edit?id=${id}`);
  };

  useEffect(() => {
    const fetchMeet = async () => {
      setLoading(true);
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL +
          "/meet/findAllMeet?sort=asc&sortBy=meetDate&page=1&limit=100&startDate=&endDate=",
        {
          headers: {
            Authorization: `Bearer ${token[0].token}`,
          },
        }
      );
      console.log(response.data);
      setMeetData(response.data.data);
      setLoading(false);
    };

    fetchMeet();
  }, []);

  return (
    <div className="bg-gray-50 overflow-auto">
      <Header />
      <div className="flex justify-between items-center px-6 mt-6">
        <input
          type="text"
          className="w-1/5 rounded-lg p-1"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => router.push("/meeting/create")}
          className="bg-blue-500 text-white p-1.5 hover:bg-blue-600 text-sm rounded-lg flex gap-1"
        >
          <MdAssignmentAdd className="h-5"/>
          <span>Add Meeting</span>
        </button>
      </div>
      <div className="w-auto min-h-[100vh] m-6 mt-2 flex gap-6 ">
        <div className="flex flex-col w-screen gap-6">
          <div className="flex flex-col max-w-screen gap-4">
            <div className="h-max min-w-96 w-full p-4 flex-col gap-4 bg-white rounded-lg shadow-lg">
              <div className="flex flex-col gap-4">
                <table className="w-full table-auto">
                  <thead>
                    <tr>
                      <th className="text-left text-sm">Meet Name</th>
                      <th className="text-left text-sm">Project Name</th>
                      <th className="text-left text-sm">Meet Date</th>
                      <th className="text-left text-sm">Meet Time</th>
                      <th className="text-left text-sm">Location</th>
                      <th className="text-left text-sm">Status</th>
                      <th className="text-left text-sm">Action</th>
                    </tr>
                  </thead>
                  {loading ? (
                    <tbody>
                      {[...Array(20)].map((_, index) => (
                        <tr key={index} className="animate-pulse odd:bg-gray-100 even:bg-gray-200">
                          <td className="py-1 text-gray-200 ">...........</td>
                          <td className="py-1 text-gray-200 ">...........</td>
                          <td className="py-1 text-gray-200 ">...........</td>
                          <td className="py-1 text-gray-200 ">...........</td>
                          <td className="py-1 text-gray-200 ">...........</td>
                          <td className="py-1 text-gray-200 ">...........</td>
                          <td className="py-1 text-gray-200 ">...........</td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <tbody>
                      {meetData
                        .filter((meet) =>
                          meet.meetTitle
                            .toLowerCase()
                            .includes(search.toLowerCase())
                        )
                        .map((meet) => (
                          <tr key={meet.idMeet} className=" even:bg-gray-100 ">
                            <td className="text-sm py-1 text-left">{meet.meetTitle}</td>
                            <td className="text-sm py-1 text-left">{meet.projectName}</td>
                            <td className="text-sm py-1 text-left">
                              {formatDate(meet.meetDate)}
                            </td>
                            <td className="text-sm py-1 text-left">
                              {new Date(meet.meetDate).toLocaleTimeString()}
                            </td>
                            <td className="text-sm py-1 text-left">
                              {meet.officeLocation !== null?(
                                meet.officeLocation
                              ):(
                                meet.alternativeLocation
                                
                              )}
                            </td>
                            <td className="text-sm py-1 text-left ">
                              {meet.status_code === 0 && (
                                <span className="bg-red-400 p-1 rounded text-white text-xs">
                                  Not Started
                                </span>
                              )}
                              {meet.status_code === 1 && (
                                <span className="bg-yellow-400 p-1 rounded text-white text-xs">
                                  In Progress
                                </span>
                              )}
                              {meet.status_code === 2 && (
                                <span className="bg-green-400 p-1 rounded text-white text-xs">
                                  Complete
                                </span>
                              )}
                            </td>
                            <td className="text-sm py-1 text-left flex justify-center">
                              <button
                                onClick={() => handleEdit(meet.idMeet)}
                                className="text-sm py-1 text-center self-center m-1 text-blue-500 md:hover:text-black md:hover:underline"
                              >
                                <FiEdit />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
