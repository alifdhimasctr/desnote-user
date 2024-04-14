"use client";
import React, { useState, useEffect, use, useRef } from "react";
import Header from "../header/header";
import Modal from "../component/modal";
import axios from "axios";
import { useCookies } from "react-cookie";
import Signature from '@uiw/react-signature';

import { useRouter, useSearchParams } from "next/navigation";



export default function EditMeet() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const data = useCookies(["user"]);
  const token = useCookies(["token"]);
  const [meetData, setMeetData] = useState([]);

  const notulensiTitle = "Notulensi " + meetData.meetTitle;
  const [notulensiContent, setNotulensiContent] = useState("");
  const [notulensiSignPIC, setNotulensiSignPIC] = useState("");
  const [notulensiSignCustomer, setNotulensiSignCustomer] = useState("");
  const createdBy = token[0].token;
  const meetIdMeet = id;
  const [dokumentasi, setDokumentasi] = useState([]);
  const router = useRouter();

  const [signCust, setSignCust] = useState("");
  const [signPIC, setSignPIC] = useState("");

  const $svg = useRef(null);

  const [idNotulensi, setIdNotulensi]  = useState("");

  console.log(id);
  console.log(token);

  const handleSaveSignPIC = async (e) => {
    e.preventDefault();

    const downloadImage = () => {
      const svgelm = $svg.current?.svg?.cloneNode(true);
      const clientWidth = $svg.current?.svg?.clientWidth;
      const clientHeight = $svg.current?.svg?.clientHeight;
      svgelm.removeAttribute('style');
      svgelm.setAttribute('width', `${clientWidth}px`);
      svgelm.setAttribute('height', `${clientHeight}px`);
      svgelm.setAttribute('viewbox', `${clientWidth} ${clientHeight}`);
      const data = new XMLSerializer().serializeToString(svgelm);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = clientWidth || 0;
        canvas.height = clientHeight || 0;
        ctx?.drawImage(img, 0, 0);
        const a = document.createElement('a');
        a.download = 'signature.png';
        a.href = canvas.toDataURL('image/png');
        console.log(a.href);
      };
      img.src = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(data)))}`;

      setNotulensiSignPIC(img.src);
      console.log(notulensiSignPIC);
    };
    downloadImage()

    e.preventDefault();
    try{
      const formData = new FormData();
      formData.append('file', notulensiSignPIC);
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL + "/notulensi/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token[0].token}`,
          },
        }
      );
      console.log(response.data);
      setNotulensiSignPIC(response.data.data);
    }
    catch (error) {
      console.log(error);
    }
  };

  const handleSaveSignCust = (e) => {
    e.preventDefault();

    const downloadImage = () => {
      const svgelm = $svg.current?.svg?.cloneNode(true);
      const clientWidth = $svg.current?.svg?.clientWidth;
      const clientHeight = $svg.current?.svg?.clientHeight;
      svgelm.removeAttribute('style');
      svgelm.setAttribute('width', `${clientWidth}px`);
      svgelm.setAttribute('height', `${clientHeight}px`);
      svgelm.setAttribute('viewbox', `${clientWidth} ${clientHeight}`);
      const data = new XMLSerializer().serializeToString(svgelm);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = clientWidth || 0;
        canvas.height = clientHeight || 0;
        ctx?.drawImage(img, 0, 0);
        const a = document.createElement('a');
        a.download = 'signature.png';
        a.href = canvas.toDataURL('image/png');
        console.log(a.href);
      };
      img.src = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(data)))}`;

      setNotulensiSignCustomer(img.src);
    };

    downloadImage()
  };
  console.log(notulensiSignCustomer);


  const FetchMeetingById = async () => {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BASE_URL + `/meet/findOne/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token[0].token}`,
        },
      }
    );
    console.log(response.data);
    setMeetData(response.data.data);
  };
  
  useEffect(() => {
    

    FetchMeetingById();
  }, []);

  console.log(meetData);
  const userData = meetData.users;
  const location = meetData.officeLocation;
  console.log(userData);

  console.log(meetData.status_code);

  const handleCreateNotulensi = async (e) => {
    e.preventDefault();

    const response = await axios.post(
      process.env.NEXT_PUBLIC_BASE_URL + "/notulensi/create-notulensi",
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
    console.log(response.data);
    setIdNotulensi(response.data.data.idNotulensi);
  };

  useEffect(() => {
    FetchMeetingById();
  }, [idNotulensi]);


  const handleUpdateNotulensi = async (e) => {
    e.preventDefault();

    const response = await axios.patch(
      process.env.NEXT_PUBLIC_BASE_URL + "/notulensi/update/" + idNotulensi,
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
    console.log(response.data);
    router.push("/meeting/edit?id=" + id);
  };

  function handleMeet() {
    if (meetData.status_code === 0) {
      return (
        <button
          onClick={handleCreateNotulensi}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Start Meet
        </button>
      );
    } else if (meetData.status_code === 1) {
      return (
        <div className="flex flex-col gap-2 mt-4">
          <form className="flex flex-col gap-2">
            <div>
              <label className="text-lg text-black font-bold">Notulensi</label>
              <textarea
                className="h-24 w-full border border-gray-300 rounded-md p-2"
                onChange={(e) => setNotulensiContent(e.target.value)}
              ></textarea>
            </div>
            <div className="flex flex-row gap-4 mb-16">
              <div>
                <label className="text-lg text-black font-bold">
                  Tanda Tangan PIC
                </label>
                <Signature
                  ref={$svg}
                  width={250}
                  height={125}
                  backgroundColor="white"
                  penColor="black"
                />
                <button
                  onClick={handleSaveSignPIC}
                  className="bg-blue-500 hover:bg-blue-700 mt-2 text-white font-bold py-1 px-3 rounded"
                >
                  Save
                </button>
              </div>
              <div>
                <label className="text-lg text-black font-bold">
                  Tanda Tangan Customer
                </label>
                <Signature
                  ref={setSignCust}
                  width={250}
                  height={125}
                  backgroundColor="white"
                  penColor="black"
                />
                <button
                  onClick={handleSaveSignCust}
                  className="bg-blue-500 hover:bg-blue-700 mt-2 text-white font-bold py-1 px-3 rounded"
                >
                  Save
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-lg text-black font-bold">
                Dokumentasi
              </label>
              <input
                type="file"
                onChange={(e) => setDokumentasi(e.target.files[0])}
              />
            </div>

            <div className="flex flex-row gap-4">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white w-1/5 font-bold py-2 px-4 rounded"
              >
                Save
              </button>
              <button
                type="submit"
                className="bg-black hover:bg-gray-800 text-white w-1/5 font-bold py-2 px-4 rounded"
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
    if (meetData.meetLink === "") {
      return <a>-</a>;
    } else {
      return <a>{meetData.meetLink}</a>;
    }
  }

  return (
    <div className="bg-gray-200 overflow-auto">
      <Header />
      <div className="w-auto min-h-[100vh] m-6 mx-12 flex gap-6 ">
        <div className=" flex h-max min-w-96 w-screen p-4 flex-col gap-4 bg-gray-100 rounded-lg shadow-lg">
          <div className="flex flex-col ">
            <a className="font-bold text-xl mb-1 text-black">
              {meetData.meetTitle}
            </a>
            <a className="text-sm text-gray-600">
              {" "}
              {new Date(meetData.meetDate).toLocaleDateString()}
            </a>
            <a className="text-sm text-gray-600">
              {new Date(meetData.meetDate).toLocaleTimeString()}
            </a>
            <a className="font-semibold text-lg text-left">Personel</a>
            {userData?.map((user) => (
              <a className="text-sm text-gray-600">- {user.name}</a>
            ))}
            <a className="font-semibold text-lg text-left">Customer</a>
            <a className="text-sm text-gray-600">{meetData.customerName}</a>
            <a className="font-semibold text-lg text-left">Location</a>
            <a className="text-sm text-gray-600">{location?.locationName}</a>
            <a className="font-semibold text-lg text-left">Link Meet</a>
            <a className="text-sm text-gray-600">{isNullMeetLink()}</a>

            {handleMeet()}
          </div>
        </div>
      </div>
    </div>
  );
}