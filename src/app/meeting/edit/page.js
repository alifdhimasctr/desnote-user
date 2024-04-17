'use client';
import React, { useState, useEffect, use, useRef } from 'react';
import Header from '../header/header';
import Modal from '../component/modal';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Signature from '@uiw/react-signature';
import dataURLtoBlob from 'blueimp-canvas-to-blob';

import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

export default function EditMeet() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const data = useCookies(['user']);
  const token = useCookies(['token']);
  const [meetData, setMeetData] = useState([]);

  const notulensiTitle = 'Notulensi ' + meetData.meetTitle;
  const [notulensiContent, setNotulensiContent] = useState('');
  const [notulensiSignPIC, setNotulensiSignPIC] = useState('');
  const [notulensiSignCustomer, setNotulensiSignCustomer] = useState('');
  const [isLoading, setIsLoading] = useState(null);
  const createdBy = token[0].token;
  const meetIdMeet = id;
  const [dokumentasi, setDokumentasi] = useState([]);
  const router = useRouter();

  const [signCust, setSignCust] = useState('');
  const [signPIC, setSignPIC] = useState('');

  const $svg = useRef(null);

  const [idNotulensi, setIdNotulensi] = useState('');

  const handleSaveSignPIC = async (e) => {
    setIsLoading('pic');
    e.preventDefault();

    const canvas = document.createElement('canvas');

    try {
      const fd = new window.FormData();
      const blob = dataURLtoBlob(canvas.toDataURL('image/png'));
      fd.append('file', blob, 'signature.png');

      const response = await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL + '/notulensi/uploadTTD',
        fd,
        {
          headers: {
            Authorization: `Bearer ${token[0].token}`,
          },
        }
      );

      await axios.patch(
        process.env.NEXT_PUBLIC_BASE_URL + '/notulensi/update/' + id,
        {
          notulensiSignPIC: response.data?.data?.fileLink,
        },
        {
          headers: {
            Authorization: `Bearer ${token[0].token}`,
          },
        }
      );

      setNotulensiSignPIC(response.data.data);
      toast.success('Unggah tanda tangan berhasil');
      setIsLoading(null);
    } catch (error) {
      console.log(error);
      toast.error(`Gagal unggah tanda tangan ${error}`);
      setIsLoading(null);
    }
  };

  const handleSaveSignPIC = async (e) => {
    setIsLoading('pic');
    e.preventDefault();

    const canvas = document.createElement('canvas');

    try {
      const fd = new window.FormData();
      const blob = dataURLtoBlob(canvas.toDataURL('image/png'));
      fd.append('file', blob, 'signature.png');

      const response = await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL + '/notulensi/uploadTTD',
        fd,
        {
          headers: {
            Authorization: `Bearer ${token[0].token}`,
          },
        }
      );

      await axios.patch(
        process.env.NEXT_PUBLIC_BASE_URL + '/notulensi/update/' + id,
        {
          notulensiSignCust: response.data?.data?.fileLink,
        },
        {
          headers: {
            Authorization: `Bearer ${token[0].token}`,
          },
        }
      );

      setNotulensiSignPIC(response.data.data);
      toast.success('Unggah tanda tangan berhasil');
      setIsLoading(null);
    } catch (error) {
      console.log(error);
      toast.error(`Gagal unggah tanda tangan ${error}`);
      setIsLoading(null);
    }
  };

  const FetchMeetingById = async () => {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BASE_URL + `/meet/findOne/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token[0].token}`,
        },
      }
    );
    setMeetData(response.data.data);
  };

  useEffect(() => {
    FetchMeetingById();
  }, []);

  const userData = meetData.users;
  const location = meetData.officeLocation;

  const handleCreateNotulensi = async (e) => {
    e.preventDefault();

    const response = await axios.post(
      process.env.NEXT_PUBLIC_BASE_URL + '/notulensi/create-notulensi',
      {
        notulensiTitle: notulensiTitle,
        notulensiContent: notulensiContent,
        notulensiSignPIC: notulensiSignPIC,
        notulensiSignCust: notulensiSignCustomer,
        createdBy: createdBy,
        meetIdMeet: meetIdMeet,
        dokumentasi: dokumentasi,
      },
      {
        headers: {
          Authorization: `Bearer ${token[0].token}`,
        },
      }
    );
    setIdNotulensi(response.data.data.idNotulensi);
  };

  useEffect(() => {
    FetchMeetingById();
  }, [idNotulensi]);

  const handleUpdateNotulensi = async (e) => {
    e.preventDefault();

    const response = await axios.patch(
      process.env.NEXT_PUBLIC_BASE_URL + '/notulensi/update/' + idNotulensi,
      {
        notulensiContent: notulensiContent,
        notulensiSignPIC: notulensiSignPIC,
        notulensiSignCust: notulensiSignCustomer,
        dokumentasi: dokumentasi,
      },
      {
        headers: {
          Authorization: `Bearer ${token[0].token}`,
        },
      }
    );
    router.push('/meeting/edit?id=' + id);
  };

  function handleMeet() {
    if (meetData.status_code === 0) {
      return (
        <button
          onClick={handleCreateNotulensi}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          Start Meet
        </button>
      );
    } else if (meetData.status_code === 1) {
      return (
        <div className='flex flex-col gap-2 mt-4'>
          <form className='flex flex-col gap-2'>
            <div>
              <label className='text-lg text-black font-bold'>Notulensi</label>
              <textarea
                className='h-24 w-full border border-gray-300 rounded-md p-2'
                onChange={(e) => setNotulensiContent(e.target.value)}
              ></textarea>
            </div>
            <div className='flex flex-row gap-4 mb-16'>
              <div>
                <label className='text-lg text-black font-bold'>
                  Tanda Tangan PIC
                </label>
                <Signature
                  ref={$svg}
                  width={250}
                  height={125}
                  backgroundColor='white'
                  penColor='black'
                />
                <button
                  onClick={handleSaveSignPIC}
                  className='bg-blue-500 hover:bg-blue-700 mt-2 text-white font-bold py-1 px-3 rounded'
                >
                  Save
                </button>
              </div>
              <div>
                <label className='text-lg text-black font-bold'>
                  Tanda Tangan Customer
                </label>
                <Signature
                  ref={setSignCust}
                  width={250}
                  height={125}
                  backgroundColor='white'
                  penColor='black'
                />
                <button
                  onClick={handleSaveSignCust}
                  className='bg-blue-500 hover:bg-blue-700 mt-2 text-white font-bold py-1 px-3 rounded'
                >
                  Save
                </button>
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-lg text-black font-bold'>
                Dokumentasi
              </label>
              <input
                type='file'
                onChange={(e) => setDokumentasi(e.target.files[0])}
              />
            </div>

            <div className='flex flex-row gap-4'>
              <button
                type='submit'
                className='bg-blue-500 hover:bg-blue-700 text-white w-1/5 font-bold py-2 px-4 rounded'
              >
                Save
              </button>
              <button
                type='submit'
                className='bg-black hover:bg-gray-800 text-white w-1/5 font-bold py-2 px-4 rounded'
              >
                End Meet
              </button>
            </div>
          </form>
        </div>
      );
    }
  }

  function isNullMeetLink() {
    if (meetData.meetLink === '') {
      return <a>-</a>;
    } else {
      return <a>{meetData.meetLink}</a>;
    }
  }

  return (
    <div className='bg-gray-200 overflow-auto'>
      <Header />
      <div className='w-auto min-h-[100vh] m-6 mx-12 flex gap-6 '>
        <div className=' flex h-max min-w-96 w-screen p-4 flex-col gap-4 bg-gray-100 rounded-lg shadow-lg'>
          <div className='flex flex-col '>
            <a className='font-bold text-xl mb-1 text-black'>
              {meetData.meetTitle}
            </a>
            <a className='text-sm text-gray-600'>
              {' '}
              {new Date(meetData.meetDate).toLocaleDateString()}
            </a>
            <a className='text-sm text-gray-600'>
              {new Date(meetData.meetDate).toLocaleTimeString()}
            </a>
            <a className='font-semibold text-lg text-left'>Personel</a>
            {userData?.map((user) => (
              <a className='text-sm text-gray-600'>- {user.name}</a>
            ))}
            <a className='font-semibold text-lg text-left'>Customer</a>
            <a className='text-sm text-gray-600'>{meetData.customerName}</a>
            <a className='font-semibold text-lg text-left'>Location</a>
            <a className='text-sm text-gray-600'>{location?.locationName}</a>
            <a className='font-semibold text-lg text-left'>Link Meet</a>
            <a className='text-sm text-gray-600'>{isNullMeetLink()}</a>

            {handleMeet()}
          </div>
        </div>
      </div>
    </div>
  );
}
