"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Flowbite } from "flowbite-react";
import Header from "../header/header";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCookies } from "react-cookie";
import { FiEdit } from "react-icons/fi";

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
          "/meet/findAllMeet?sort=desc&sortBy=meetDate&page=1&limit=100&startDate=&endDate=",
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
    <div className="bg-gray-200 overflow-auto">
      <Header />
      <div className="flex justify-between items-center px-6 mt-6">
        <input
          type="text"
          className="w-1/5 rounded-lg p-1"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <a
          href="/meeting/create"
          className="bg-blue-500 p-2 px-3 text-sm text-white rounded-lg flex items-center justify-center hover:bg-blue-600"
        >
          + Create Meet
        </a>
      </div>
      <div className="w-auto min-h-[100vh] m-6 mt-2 flex gap-6 ">
        <div className="flex flex-col w-screen gap-6">
          <div className="flex flex-col max-w-screen gap-4">
            <div className="h-max min-w-96 w-full p-4 flex-col gap-4 bg-white rounded-lg shadow-lg">
              <div className="flex flex-col gap-4">
                <table className="w-full table-auto border-separate border-spacing-y-2">
                  <thead>
                    <tr>
                      <th className="text-left">Meet Title</th>
                      <th className="text-left">Meet Date</th>
                      <th className="text-left">Meet Time</th>
                      <th className="text-left">Location</th>
                      <th className="text-left">Status</th>
                      <th className="text-left">Action</th>
                    </tr>
                  </thead>
                  {loading ? (
                    <tbody>
                      {[...Array(10)].map((_, index) => (
                        <tr key={index} className="animate-pulse bg-gray-200">
                          <td className="py-2 bg-gray-200 text-gray-200 ">...........</td>
                          <td className="py-2 bg-gray-200 text-gray-200 ">...........</td>
                          <td className="py-2 bg-gray-200 text-gray-200 ">...........</td>
                          <td className="py-2 bg-gray-200 text-gray-200 ">...........</td>
                          <td className="py-2 bg-gray-200 text-gray-200 ">...........</td>
                          <td className="py-2 bg-gray-200 text-gray-200 ">...........</td>
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
                          <tr key={meet.idMeet} className="bg-gray-50 rounded ">
                            <td className="py-2">{meet.meetTitle}</td>
                            <td className="py-2">
                              {formatDate(meet.meetDate)}
                            </td>
                            <td className="py-2">
                              {new Date(meet.meetDate).toLocaleTimeString()}
                            </td>
                            <td className="py-2">
                              {meet.officeLocation.locationName}
                            </td>
                            <td className="py-2">
                              {meet.status_code === 0 && (
                                <span className="bg-red-400 p-1 rounded text-white text-sm">
                                  Not Started
                                </span>
                              )}
                              {meet.status_code === 1 && (
                                <span className="bg-yellow-400 p-1 rounded text-white text-sm">
                                  In Progress
                                </span>
                              )}
                              {meet.status_code === 2 && (
                                <span className="bg-green-400 p-1 rounded text-white text-sm">
                                  Complete
                                </span>
                              )}
                            </td>
                            <td className="py-2 flex justify-center">
                              <button
                                onClick={() => handleEdit(meet.idMeet)}
                                className="text-sm text-center self-center m-1 text-blue-500 md:hover:text-black md:hover:underline"
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
