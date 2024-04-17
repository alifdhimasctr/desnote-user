'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Flowbite } from 'flowbite-react';
import Select from 'react-select';
import Header from '../../header/header';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Router, useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { toast } from 'react-toastify';

export default function CreateMeet() {
  const token = useCookies(['token']);
  const data = useCookies(['user']);
  const router = useRouter();

  const getCurrentDateISOString = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T00:00`;
  };

  const [personelData, setPersonelData] = useState([]);
  const [locationData, setLocationData] = useState([]);

  const [formData, setFormData] = useState({
    meetTitle: '',
    meetDate: '',
    users: [],
    location: '',
    meetLink: '',
    customerName: '',
    customerEmail: '',
    meetReminder: null,
  });

  const [fileData, setFileData] = useState([]);
  const [fileValue, setFileValue] = useState('');
  const [isLoading, setIsLoading] = useState(null);

  useEffect(() => {
    const fetchPersonel = async () => {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL + '/admin/findAllUser',
        {
          headers: {
            Authorization: `Bearer ${token[0].token}`,
          },
        }
      );
      console.log(response.data);
      setPersonelData(response.data.data);
    };

    const fetchLocation = async () => {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL + '/office/findAllOfficeLocation',
        {
          headers: {
            Authorization: `Bearer ${token[0].token}`,
          },
        }
      );
      console.log(response.data);
      setLocationData(response.data.data);
    };

    fetchLocation();
    fetchPersonel();
  }, []);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    setIsLoading('file');
    try {
      const formData = new FormData();
      formData.append('file', fileData);
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL + '/uploadFile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token[0].token}`,
          },
        }
      );
      if (response.data.status === 200) {
        setIsLoading(null);
        console.log(response.data);
        setFileValue(response.data.data);
        toast.success('Upload File Success');
      }
    } catch (error) {
      setIsLoading(null);
      toast.success(`Upload File Failed : ${error}`);
      console.log(error);
    }
  };

  const handleCreateMeet = async (e) => {
    setIsLoading('meet');
    e.preventDefault();

    if (fileValue === '') {
      setIsLoading(null);
      toast.error('Please Upload File');
      return;
    }

    try {
      const idFileContainer = fileValue[0].idFileContainer;

      const response = await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL + '/meet/create-meet',
        {
          meetTitle: formData.meetTitle,
          meetDate: formData.meetDate,
          users: formData.users,
          idOfficeLocations: formData.location,
          meetLink: formData.meetLink,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          fileAttachment: [idFileContainer],
          meetReminder: parseInt(formData.meetReminder),
        },
        {
          headers: {
            Authorization: `Bearer ${token[0].token}`,
          },
        }
      );

      console.log(response.data);
      if (response.data.status === 200) {
        setIsLoading(null);
        router.push('/meeting');
      }
    } catch (error) {
      setIsLoading(null);
      toast.success(`Create Meet Failed : ${error}`);
      console.log(error);
    }
  };

  return (
    <div>
      <Header />
      <div className='bg-gray-200 overflow-auto'>
        <div className='w-auto min-h-[100vh] m-6 mx-28 flex gap-6 '>
          <div className='h-max min-w-96 w-screen p-4 flex-col gap-4 bg-gray-100 rounded-lg shadow-lg'>
            <h1 className='font-bold text-xl mb-3 text-black'>
              Create Meeting
            </h1>
            <form onSubmit={handleCreateMeet} className='flex flex-col gap-4'>
              <div>
                <label
                  for='meetingTitle'
                  className='font-semibold text-left ml-2'
                >
                  Name
                </label>
                <input
                  type='text'
                  id='meetingTitle'
                  name='meetingTitle'
                  placeholder='Meeting Name'
                  className='w-full p-2 my-2 bg-white shadow-md rounded-lg'
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, meetTitle: e.target.value })
                  }
                />
              </div>

              <div className='flex flex-col gap-2'>
                <label
                  for='meetingDate'
                  className='font-semibold text-left ml-2'
                >
                  Date
                </label>
                <input
                  type='datetime-local'
                  id='meetingDate'
                  name='meetingDate'
                  className='w-1/4 p-2 bg-white shadow-md rounded-lg'
                  required
                  min={getCurrentDateISOString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meetDate: new Date(e.target.value).toISOString(),
                    })
                  }
                />
              </div>

              <div className='flex flex-col gap-2'>
                <label for='users' className='font-semibold text-left ml-2'>
                  Personel
                </label>
                <Select
                  name='users'
                  id='users'
                  className='w-full bg-white shadow-md rounded-lg'
                  isMulti
                  options={personelData.map((person) => ({
                    value: person.id,
                    label: person.name,
                  }))}
                  isClearable={true}
                  isSearchable={true}
                  isRequired={true}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      users: e.map((person) => person.value),
                    })
                  }
                ></Select>
              </div>

              <div className='flex flex-col gap-2'>
                <label for='location' className='font-semibold text-left ml-2'>
                  Location
                </label>
                <select
                  name='location'
                  id='location'
                  className='w-full p-2 px-3 bg-white shadow-md rounded-lg'
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                >
                  <option value='' disabled selected>
                    Select
                  </option>
                  {locationData.map((loc) => (
                    <option
                      key={loc.idOfficeLocation}
                      value={loc.idOfficeLocation}
                    >
                      {loc.locationName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label for='meetLink' className='font-semibold text-left ml-2'>
                  Meeting Link
                </label>
                <input
                  type='text'
                  id='meetingLink'
                  name='meetingLink'
                  placeholder='Meeting Link'
                  className='w-full p-2 bg-white shadow-md rounded-lg'
                  onChange={(e) =>
                    setFormData({ ...formData, meetLink: e.target.value })
                  }
                />
              </div>

              <div className='grid grid-cols-2 gap-2 w-full'>
                <div>
                  <label
                    for='customerName'
                    className='font-semibold text-left ml-2'
                  >
                    Customer Name
                  </label>
                  <input
                    type='text'
                    id='customerName'
                    name='customerName'
                    placeholder='Customer Name'
                    className='w-full p-2 bg-white shadow-md rounded-lg'
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    for='customerEmail'
                    className='font-semibold text-left ml-2'
                  >
                    Customer Email
                  </label>
                  <input
                    type='email'
                    id='customerEmail'
                    name='customerEmail'
                    placeholder='Customer Email'
                    className='w-full p-2 bg-white shadow-md rounded-lg'
                    required
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customerEmail: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label
                  for='uploadFile'
                  className='font-semibold text-left ml-2'
                >
                  File
                </label>
                <div className='flex flex-row gap-2 items-center'>
                  <input
                    type='file'
                    id='uploadFile'
                    name='uploadFile'
                    className='w-3/4 p-2 bg-white shadow-md rounded-lg'
                    required
                    onChange={(e) => setFileData(e.target.files)}
                    multiple={false}
                  />
                  <button
                    className='p-2 px-3 bg-blue-500 text-white rounded-lg'
                    onClick={handleFileUpload}
                  >
                    {isLoading === 'file' ? 'Loading' : 'Upload'}
                  </button>
                </div>
              </div>

              <div className='flex flex-col'>
                <label
                  for='meetReminder'
                  className='font-semibold text-left ml-2'
                >
                  Reminder
                </label>
                <input
                  type='number'
                  id='meetReminder'
                  name='meetReminder'
                  placeholder='Reminder'
                  className='w-1/4 p-2 bg-white shadow-md rounded-lg'
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, meetReminder: e.target.value })
                  }
                />
              </div>

              <button
                type='submit'
                className={twMerge(
                  'w-max p-2 px-3 bg-blue-500 text-white rounded-lg',
                  fileValue === '' ? 'bg-gray-300' : 'bg-blue-500'
                )}
                disabled={fileValue === '' ? true : false}
              >
                {isLoading === 'meet' ? 'Loading' : 'Create Meet'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
