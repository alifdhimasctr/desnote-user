"use client";
import React, { useState, useEffect, useRef } from "react";
import Header from "../../header/header";
import Modal from "../component/modal";
import axios from "axios";
import { useCookies } from "react-cookie";
import Signature from "@uiw/react-signature";
import dataURLtoBlob from "blueimp-canvas-to-blob";
import modal from "../component/modal";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

import JoditEditor from "jodit-react";
import { set } from "jodit/esm/core/helpers";

import { FaPeopleGroup } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa6";
import { MdPeopleAlt } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { IoLink } from "react-icons/io5";
import { FaFile } from "react-icons/fa";
import { MdAssignmentAdd } from "react-icons/md";
import { FaFileSignature } from "react-icons/fa";
import { MdAddPhotoAlternate } from "react-icons/md";

export default function EditMeet() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const data = useCookies(["user"]);
  const token = useCookies(["token"]);
  const [meetData, setMeetData] = useState([]);
  const [detailNotulensi, setDetailNotulensi] = useState([]);

  //show modal
  const [showNotulensiModal, setShowNotulensiModal] = useState(false);
  const [showPICModal, setShowPICModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showDokumentasiModal, setShowDokumentasiModal] = useState(false);

  const editor = useRef(null);

  const [file, setFile] = useState(null);
  const [filePIC, setFilePIC] = useState(null);
  const [fileCustomer, setFileCustomer] = useState(null);

  const notulensiTitle = "Notulensi " + meetData.meetTitle;
  const [notulensiContent, setNotulensiContent] = useState("");
  const [notulensiSignPIC, setNotulensiSignPIC] = useState("");
  const [notulensiSignCustomer, setNotulensiSignCustomer] = useState("");
  const [isLoading, setIsLoading] = useState(null);
  const createdBy = token[0].token;
  const meetIdMeet = id;
  const [dokumentasi, setDokumentasi] = useState([]);
  const [namaDokumentasi, setNamaDokumentasi] = useState([]);
  const router = useRouter();

  const [signCustomer, setSignCustomer] = useState("");
  const [signPIC, setSignPIC] = useState("");

  const svgPic = useRef(null);
  const svgCust = useRef(null);

  const [idNotulensi, setIdNotulensi] = useState("");
  const [loading, setLoading] = useState(true);

  const [fileUrl, setFileUrl] = useState("");

  
  // useEffect(() => {
  //   const FetchMeetingById = async () => {
  //     const response = await axios.get(
  //       process.env.NEXT_PUBLIC_BASE_URL + `/meet/findOne/${id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token[0].token}`,
  //         },
  //       }
  //     );
  //     setMeetData(response.data.data);
  //     setLoading(false);
  //   };

  //   FetchMeetingById();
  // }, []);

  // console.log(meetData);
  // const idNotulensis = meetData.notulensi[0].idNotulensi;
  // console.log(`idNotulensis`, idNotulensis);
  // const notulensi = meetData.notulensi;
  // // console.log(notulensi[0].idNotulensi);

  useEffect(() => {
    const fetchMeetingById = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BASE_URL + `/meet/findOne/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token[0].token}`,
            },
          }
        );
        setMeetData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching meeting by ID:", error);
        setLoading(false);
      }
    };

    fetchMeetingById();
  }, [idNotulensi]);

  console.log(meetData);

  useEffect(() => {
    if (meetData && meetData.notulensi && meetData.notulensi.length > 0) {
      const idNotulensis = meetData.notulensi[0].idNotulensi;
      console.log(`idNotulensis`, idNotulensis);

      const fetchNotulensiById = async () => {
        try {
          const response = await axios.get(
            process.env.NEXT_PUBLIC_BASE_URL +
              `/notulensi/findOne/${idNotulensis}`,
            {
              headers: {
                Authorization: `Bearer ${token[0].token}`,
              },
            }
          );
          setDetailNotulensi(response.data.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching notulensi by ID:", error);
          setLoading(false);
        }
      };


      fetchNotulensiById();
    } else {
      console.log("No notulensi data available");
    }
  }, [meetData, token, idNotulensi]);

  console.log(detailNotulensi);
  const idNotulensi1 = detailNotulensi.idNotulensi;

  const userData = meetData.users;
  const fileData = meetData.fileAttachment;
  const location = meetData.officeLocation;

  const handleCreateNotulensi = async (e) => {
    e.preventDefault();
    setIsLoading("create");

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
    setIdNotulensi(response.data.data.idNotulensi);
    setIsLoading(null);
  };

  const handleUpdateNotulensiContent = async (e) => {
    e.preventDefault();
    setIsLoading("update");

    const response = await axios.patch(
      process.env.NEXT_PUBLIC_BASE_URL + "/notulensi/update/" + idNotulensi1,
      {
        notulensiContent: notulensiContent,
      },
      {
        headers: {
          Authorization: `Bearer ${token[0].token}`,
        },
      }
    );
    setIsLoading(null);
    setShowNotulensiModal(false);
  };

  const handleSaveSignPIC = async (e) => {
    e.preventDefault();
    setIsLoading("update");

    if(filePIC){
      const formData = new FormData();
      formData.append("file", filePIC);

      try {
        const response = await axios.post(
          process.env.NEXT_PUBLIC_BASE_URL + "/uploadFile",
          formData,
          {
            headers: {
              "content-type": "multipart/form-data",
              Authorization: `Bearer ${token[0].token}`,
            },
          }
        );
        console.log(response.data.data[0]);
        setNotulensiSignPIC(response.data.data[0].idFileContainer);

        await axios.patch(
          process.env.NEXT_PUBLIC_BASE_URL + "/notulensi/update/" + idNotulensi1,
          {
            notulensiSignPIC: response.data.data[0].fileLink,
          },
          {
            headers: {
              Authorization: `Bearer ${token[0].token}`,
            },
          }
        );

        setIsLoading(null);
        toast.success("Tanda tangan PIC berhasil diunggah");
        setShowPICModal(false);
      } catch (error) {
        console.log(error);
        toast.error("Gagal mengunggah tanda tangan PIC");
        setIsLoading(null);
      }
    }
  };

  const handleSaveSignCustomer = async (e) => {
    e.preventDefault();
    setIsLoading("update");

    if(fileCustomer){
      const formData = new FormData();
      formData.append("file", fileCustomer);

      try {
        const response = await axios.post(
          process.env.NEXT_PUBLIC_BASE_URL + "/uploadFile",
          formData,
          {
            headers: {
              "content-type": "multipart/form-data",
              Authorization: `Bearer ${token[0].token}`,
            },
          }
        );
        console.log(response.data.data[0]);
        setNotulensiSignCustomer(response.data.data[0].idFileContainer);

        await axios.patch(
          process.env.NEXT_PUBLIC_BASE_URL + "/notulensi/update/" + idNotulensi1,
          {
            notulensiSignCust: response.data.data[0].fileLink,
          },
          {
            headers: {
              Authorization: `Bearer ${token[0].token}`,
            },
          }
        );
        setIsLoading(null);
        toast.success("Tanda tangan Customer berhasil diunggah");
        setShowCustomerModal(false);
      } catch (error) {
        console.log(error);
        toast.error("Gagal mengunggah tanda tangan Customer");
        setIsLoading(null);
      }
    }
  };



  const handleUpdateDokumentasi = async (e) => {
    e.preventDefault();
    setIsLoading("update");

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          process.env.NEXT_PUBLIC_BASE_URL + "/uploadFile",
          formData,
          {
            headers: {
              "content-type": "multipart/form-data",
              Authorization: `Bearer ${token[0].token}`,
            },
          }
        );
        console.log(response.data.data[0]);
        setDokumentasi((prev) => [
          ...prev,
          response.data.data[0].idFileContainer,
        ]);
        setNamaDokumentasi((prev) => [
          ...prev,
          response.data.data[0].fileTitle,
        ]);
        setIsLoading(null);
        toast.success("Dokumentasi berhasil diunggah");
      } catch (error) {
        console.log(error);
        toast.error("Gagal mengunggah dokumentasi");
        setIsLoading(null);
      }
    }
  };

  const handleUpdateDokumentasi1 = async (e) => {
    e.preventDefault();
    setIsLoading("update1");
    const response = await axios.patch(
      process.env.NEXT_PUBLIC_BASE_URL + "/notulensi/update/" + idNotulensi1,
      {
        dokumentasi: dokumentasi,
      },
      {
        headers: {
          Authorization: `Bearer ${token[0].token}`,
        },
      }
    );
    setIsLoading(null);
    setShowDokumentasiModal(false);
    toast.success("Dokumentasi berhasil disimpan");
  };

  const handleEndMeet = async (e) => {
    e.preventDefault();
    setIsLoading("end");
    const response = await axios.patch(
      process.env.NEXT_PUBLIC_BASE_URL + "/meet/finish/" + id,
      {
        status_code: 2,
      },
      {
        headers: {
          Authorization: `Bearer ${token[0].token}`,
        },
      }
    );
    setIsLoading(null);
    router.push("/meeting");
    toast.success("Meeting telah selesai");
  };

  const handleDownload = async (e) => {
    setIsLoading("download");
    e.preventDefault();

    const response = await axios.get(
      process.env.NEXT_PUBLIC_BASE_URL + "/notulensi/download/" + idNotulensi1,
      {
        headers: {
          Authorization: `Bearer ${token[0].token}`,
          Accept: "application/json",
        },
        responseType: "arraybuffer",
      }
    );
    setIsLoading(null);
    toast.success("Notulensi berhasil diunduh");
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `notulensi ${meetData.meetTitle}.pdf`);
    document.body.appendChild(link);
    link.click();
  };




  console.log(idNotulensi1);
  console.log(notulensiContent);
  console.log(notulensiSignPIC);
  console.log(notulensiSignCustomer);
  console.log(dokumentasi);

  function handleMeet() {
    if (meetData.status_code === 0) {
      return (
        <button
          onClick={handleCreateNotulensi}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isLoading === "create" ? "Loading..." : "Start Meet"}
        </button>
      );
    } else if (meetData.status_code === 1) {
      return (
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex flex-col gap-2">
            {detailNotulensi.notulensiContent === "" ? (
              <div className="flex flex-col gap-2">
                {detailNotulensi.notulensiSignPIC === "" || detailNotulensi.notulensiSignCust === "" ? (
                  <button
                  onClick={() => setShowNotulensiModal(true)}
                  className="flex flex-row gap-1 bg-green-400 hover:bg-green-500 text-sm text-white w-max py-1 px-2 rounded-md align-middle"
                >
                  <MdAssignmentAdd className="h-5 w-5 text-white" />
                  <a className="self-center">Add Notulensi</a>
                </button>
                ) : (
                  null
                )}
                <div className="flex flex-col bg-gray-100 p-4 gap-2 w-full">
                  <div className="flex flex-col gap-2">
                    <a className="font-semibold text-sm">Notulensi</a>
                    <a className="text-gray-600 text-sm">Notulensi Kosong</a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {detailNotulensi.notulensiSignPIC === "" || detailNotulensi.notulensiSignCust === "" ? (
                  <button
                  onClick={() => setShowNotulensiModal(true)}
                  className="flex flex-row gap-1 bg-blue-400 hover:bg-blue-500 text-sm text-white w-max py-1 px-2 rounded-md align-middle"
                >
                  <MdAssignmentAdd className="h-5 w-5 text-white" />
                  <a className="self-center">Edit Notulensi</a>
                </button>
                ) : (
                  null
                )}
                <div className="flex flex-col bg-gray-100 px-4 py-2 gap-2 w-full">
                  <div className="flex flex-col gap-2">
                    <a className="font-semibold text-sm">Notulensi</a>
                    <a className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: detailNotulensi.notulensiContent }}></a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {detailNotulensi.notulensiSignPIC === "" ? (
              <button
                onClick={() => setShowPICModal(true)}
                className="flex flex-row gap-1 bg-green-400 hover:bg-green-500 text-sm text-white w-max py-1 px-2 rounded-md align-middle"
              >
                <FaFileSignature className="h-5 w-5 text-white" />
                <a className="self-center">Add PIC Sign</a>
              </button>
            ) : (
              <div className="flex flex-col bg-white px-4 gap-2 w-full">
                <div className="flex flex-col gap-2">
                  <a className="font-semibold text-sm">PIC Sign</a>
                  <img
                    src={detailNotulensi.notulensiSignPIC}
                    className="h-32 w-64 border-2 border-gray-200"
                  />
                </div>
              </div>
            )}
            {detailNotulensi.notulensiSignCust === "" ? (
              <button
                onClick={() => setShowCustomerModal(true)}
                className="flex flex-row gap-1 bg-green-400 hover:bg-green-500 text-sm text-white w-max py-1 px-2 rounded-md align-middle"
              >
                <FaFileSignature className="h-5 w-5 text-white" />
                <a className="self-center">Add Customer Sign</a>
              </button>
            ) : (
              <div className="flex flex-col bg-white px-4 gap-2 w-full">
                <div className="flex flex-col gap-2">
                  <a className="font-semibold text-sm">Customer Sign</a>
                  <img
                    src={detailNotulensi.notulensiSignCust}
                    className="h-32 w-64 border-2 border-gray-200"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShowDokumentasiModal(true)}
              className="flex flex-row gap-1 bg-green-400 hover:bg-green-500 text-sm text-white w-max py-1 px-2 rounded-md align-middle"
            >
              <MdAddPhotoAlternate className="h-5 w-5 text-white" />
              <a className="self-center">Add Dokumentasi</a>
            </button>

            <div className="flex flex-col bg-gray-100 px-4 py-2 gap-2 w-full">
              <div className="flex flex-col gap-2">
                <a className="font-semibold text-sm">Dokumentasi</a>
                <div className="flex flex-row gap-2">
                  {detailNotulensi.dokumentasi?.map((dok) => (
                    <img
                      src={dok.fileLink}
                      className="h-16 w-16 overflow-hidden rounded-lg border-2 border-gray-200"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleEndMeet}
            className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/4"
          >
            {isLoading === "end" ? "Loading..." : "End Meet"}
          </button>
        </div>
      );
    } else if (meetData.status_code === 2) {
      return (
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex flex-col bg-gray-100 px-4 py-2 gap-2 w-full">
                  <div className="flex flex-col gap-2">
                    <a className="font-semibold text-sm">Notulensi</a>
                    <a className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: detailNotulensi.notulensiContent }}></a>
                  </div>
                </div>
          <div className="flex flex-row gap-2">
            <div className="flex flex-col gap-2">
              <a className="font-semibold">Tanda Tangan PIC</a>
              <img
                src={detailNotulensi.notulensiSignPIC}
                className="h-32 w-64 border-2 border-gray-200" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <a className="font-semibold">Tanda Tangan Customer</a>
              <img
                src={detailNotulensi.notulensiSignCust}
                className="h-32 w-64 border-2 border-gray-200"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <a className="font-semibold">Dokumentasi</a>
            <div className="flex flex-row gap-2">
            {detailNotulensi.dokumentasi?.map((dok) => (
                    <img
                      src={dok.fileLink}
                      className="h-28 w-28 overflow-hidden rounded-lg border-2 border-gray-200"
                    />
                  ))}
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isLoading === "download" ? "Loading..." : "Download Notulensi"}
          </button>
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
    <div className="bg-blue-50 overflow-auto">
      <Header />
      <div className="w-auto min-h-[100vh] m-6 mx-12 flex gap-6 ">
        <div className=" flex h-max min-w-96 w-screen p-4 flex-col gap-4 bg-white rounded-lg shadow-lg">
          {loading ? (
            <div className="flex flex-col animate-pulse gap-2">
              <div className="h-10 w-52 bg-gray-200"></div>
              <div className="h-6 w-36 bg-gray-200"></div>
              <div className="h-6 w-36 bg-gray-200"></div>
              <div className="h-6 w-36 bg-gray-200"></div>
              <div className="h-6 w-36 bg-gray-200"></div>
              <div className="h-6 w-36 bg-gray-200"></div>
              <div className="h-6 w-36 bg-gray-200"></div>
              <div className="h-6 w-36 bg-gray-200"></div>
              <div className="h-6 w-36 bg-gray-200"></div>
              <div className="h-6 w-36 bg-gray-200"></div>
              <div className="h-6 w-36 bg-gray-200"></div>
              
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <a className="font-bold text-xl mb-1 text-black">
                {meetData.meetTitle}
              </a>

              <div className="flex flex-row gap-2">
                <FaClock className="text-gray-600 text-lg h-6 w-6 self-center" />
                <div className="flex flex-col">
                  <a className="text-sm text-black font-semibold">Meet date</a>
                  <a className="text-sm text-gray-600">
                    {new Date(meetData.meetDate).toLocaleDateString()}
                    {new Date(meetData.meetDate).toLocaleTimeString()}
                  </a>
                </div>
              </div>

              <div className="flex flex-row gap-2">
                <FaBuilding className="text-gray-600 text-lg h-6 w-6 self-center" />
                <div className="flex flex-col">
                  <a className="text-sm text-black font-semibold">
                    Project Name
                  </a>
                  <a className="text-sm text-gray-600">
                    {meetData.projectName}
                  </a>
                </div>
              </div>

              <div className="flex flex-row gap-2">
                <MdPeopleAlt className="text-gray-600 text-lg h-6 w-6 self-center" />
                <div className="flex flex-col">
                  <a className="text-sm text-black font-semibold">
                    Involved Staff
                  </a>
                  {userData?.map((user) => {
                    return <a className="text-sm text-gray-600">{user.name}</a>;
                  })}
                </div>
              </div>

              <div className="flex flex-row gap-2">
                <FaPeopleGroup className="text-gray-600 text-lg h-6 w-6 self-center" />
                <div className="flex flex-col">
                  <a className="text-sm text-black font-semibold">Customer</a>
                  <a className="text-sm text-gray-600">
                    {meetData.customerName}
                  </a>
                </div>
              </div>

              <div className="flex flex-row gap-2">
                <FaLocationDot className="text-gray-600 text-lg h-6 w-6 self-center" />
                <div className="flex flex-col">
                  <a className="text-sm text-black font-semibold">Location</a>
                  <a className="text-sm text-gray-600">{meetData.officeLocation.locationName}{meetData.alternativeLocation}</a>
                </div>
              </div>

              <div className="flex flex-row gap-2">
                <IoLink className="text-gray-600 text-lg h-6 w-6 self-center" />
                <div className="flex flex-col">
                  <a className="text-sm text-black font-semibold">Meet Link</a>
                  {isNullMeetLink()}
                </div>
              </div>

              <div className="flex flex-row gap-2">
                <FaFile className="text-gray-600 text-lg h-6 w-6 self-center" />
                <div className="flex flex-col">
                  <a className="text-sm text-black font-semibold">
                    File Attachment
                  </a>
                  {fileData?.map((file) => {
                    return (
                      <a className="text-sm text-gray-600">{file.fileTitle}</a>
                    );
                  })}
                </div>
              </div>

              {handleMeet()}
            </div>
          )}
        </div>
      </div>
      <Modal
        isVisible={showNotulensiModal}
        onClose={() => setShowNotulensiModal(false)}
      >
        <div className="flex flex-col gap-4">
        {detailNotulensi.notulensiContent === "" ? (
          <p className="font-semibold">Create Notulensi</p>
        ) : (
          <p className="font-semibold">Edit Notulensi</p>
        
        )}
          <JoditEditor
            ref={editor}
            value={notulensiContent}
            tabIndex={1}
            onBlur={(newContent) => setNotulensiContent(newContent)}
            onChange={(newContent) => {}}
          />
        </div>

        <button
          onClick={handleUpdateNotulensiContent}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isLoading === "update" ? "Loading..." : "Save"}
        </button>
      </Modal>
      <Modal
        isVisible={showPICModal}
        onClose={() => setShowPICModal(false)}
      >
        <div className="flex flex-col gap-4">
        <p className="font-semibold">Add PIC Sign</p>
          <div className="flex flex-row gap-2">
            <input type="file" className="w-full" onChange={(e) => setFilePIC(e.target.files[0])} />
            <button
              onClick={handleSaveSignPIC}
              className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded w-max"
            >
              {isLoading === "update" ? "Loading..." : "Upload"}
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isVisible={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
      >
        <div className="flex flex-col gap-4">
        <p className="font-semibold">Add Customer Sign</p>
          <div className="flex flex-row gap-2">
            <input type="file" className="w-full" onChange={(e) => setFileCustomer(e.target.files[0])} />
            <button
              onClick={handleSaveSignCustomer}
              className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded w-max"
            >
              {isLoading === "update" ? "Loading..." : "Upload"}
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isVisible={showDokumentasiModal}
        onClose={() => setShowDokumentasiModal(false)}
      >
        <div className="flex flex-col gap-4">
          <p className="font-semibold">Upload Dokumentasi</p>
          <div className="flex flex-row gap-2">
            <input type="file" className="w-full bg-gray-100" onChange={(e) => setFile(e.target.files[0])} />
            <button
              onClick={handleUpdateDokumentasi}
              className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded w-max"
            >
              {isLoading === "update" ? "Loading..." : "Upload"}
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {namaDokumentasi?.map((dok) => (
              <div className="flex flex-row gap-2">
                <a>{dok}</a>
              </div>
            ))}
          </div>
          <button
            onClick={handleUpdateDokumentasi1}
            className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded w-max"
          >
            {isLoading === "update1" ? "Loading..." : "Save"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
