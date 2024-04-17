'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Flowbite } from 'flowbite-react';
import Header from '../header/header';
import axios from 'axios';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCookies } from 'react-cookie';

export default function Meet() {
  const [meetData, setMeetData] = useState([]);
  const router = useRouter();
  const token = useCookies(['token']);
  const data = useCookies(['user']);

  const handleEdit = (id) => {
    router.push(`/meeting/edit?id=${id}`);
  };

  useEffect(() => {
    const fetchMeet = async () => {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL +
          '/meet/findAllMeet?sort=desc&sortBy=meetDate&page=1&limit=100&startDate=&endDate=',
        {
          headers: {
            Authorization: `Bearer ${token[0].token}`,
          },
        }
      );
      console.log(response.data);
      setMeetData(response.data.data);
    };

    fetchMeet();
  }, []);

  return (
    <div className='bg-gray-200 overflow-auto'>
      <Header />
      <div className='flex justify-between items-center p-6'>
        <div className='font-black text-gray-600 text-2xl'>MEETING</div>
        <a
          href='/meeting/create'
          className='bg-blue-500 p-2 px-3 text-sm text-white rounded-lg flex items-center justify-center hover:bg-blue-600'
        >
          + Create Meet
        </a>
      </div>
      <div className='w-auto min-h-[100vh] m-6 mt-2 flex gap-6 '>
        <div className='flex flex-col w-screen gap-6'>
          <div className='flex flex-col max-w-screen gap-4'>
            <div className='h-max min-w-96 w-full p-4 flex-col gap-4 bg-white rounded-lg shadow-lg'>
              <div className='grid grid-cols-2 gap-4'>
                {meetData.map((meet) => (
                  <div className='flex bg-gray-100 rounded-lg p-2 my-2 justify-between'>
                    <div className='flex flex-col justify-center'>
                      <a className='font-semibold text'>{meet.meetTitle}</a>
                      <div className='text-[0.75rem] mt-1 text-gray-500'>
                        {new Date(meet.meetDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className='flex flex-row gap-2'>
                      <div className='flex p-2 m-1 bg-white rounded-xl align-middle gap-2'>
                        <div className='flex flex-col'>
                          <a className='text-[0.75rem]'>Lokasi</a>
                          <a className='font-semibold text-md text-black'>
                            {meet.officeLocation.locationName}
                          </a>
                        </div>
                      </div>
                      <div className='flex p-2 m-1 bg-white rounded-xl align-middle gap-2'>
                        <div className='flex justify-center flex-col'>
                          <a className='font-semibold text-sm'>
                            {new Date(meet.meetDate).toLocaleTimeString()}
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => handleEdit(meet.idMeet)}
                        className='text-sm text-right self-center m-1 text-blue-500 md:hover:text-black md:hover:underline'
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
