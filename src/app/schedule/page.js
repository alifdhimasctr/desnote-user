"use client"
import React, {useState, useEffect} from "react";
import Header from "../header/header";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Calendar } from "@fullcalendar/core";
import axios from "axios";
import { useCookies } from "react-cookie";


export default function page() {

  const token = useCookies(["token"]);
  const data = useCookies(["user"]);

  const [meetData, setMeetData] = useState([]);

  useEffect(() => {
    const fetchMeet = async () => {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL + "/meet/findAllMeet?sort=desc&sortBy=meetDate&page=1&limit=100&startDate=&endDate=",
        {
          headers: {
            Authorization: `Bearer ${token[0].token}`,
          },
        }
      );
      console.log(response.data);
      setMeetData(response.data.data);
    }

    fetchMeet();
  } , []);

  const event = meetData.map((meet) => {
    return {
      title: meet.meetTitle,
      start: meet.meetDate,
    };
  });

  console.log(event);




  return (
    <div className="overflow-auto bg-gray-200">
      <Header />
      <div className="min-h-screen">
        <div className="p-10 m-8 mx-20 bg-white rounded-lg shadow-md min-w-max">
          <div className=" w-full">
          <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,listMonth"
          }}
          events={event}

 

          

          
        />
          </div>
        </div>
        
      </div>
    </div>
  );
}
