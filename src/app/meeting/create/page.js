"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import { Flowbite } from "flowbite-react";
import Select from "react-select";
import Header from "../../header/header";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Router, useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { toast } from "react-toastify";

import { IoIosClose } from "react-icons/io";

export default function CreateMeet() {
  const token = useCookies(["token"]);
  const data = useCookies(["user"]);
  const router = useRouter();

  const getCurrentDateISOString = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}T00:00`;
  };

  const [personelData, setPersonelData] = useState([]);
  const [locationData, setLocationData] = useState([]);

  const [formData, setFormData] = useState({
    meetTitle: "",
    projectName: "",
    meetDate: "",
    users: [],
    location: null,
    alternativeLocation: "",
    meetLink: "",
    customerName: "",
    customerEmail: "",
    meetReminder: null,
  });

  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [fileAttachment, setFileAttachment] = useState([]);

  const [isLoading, setIsLoading] = useState(null);

  useEffect(() => {
    const fetchPersonel = async () => {
      // show all user that avaiability is true
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL + "/staff/findAllStaff",
        {
          headers: {
            Authorization: `Bearer ${token[0].token}`,
          },
        }
      );
      setPersonelData(response.data.data);
    };

    const fetchLocation = async () => {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL + "/office/findAllOfficeLocation",
        {
          headers: {
            Authorization: `Bearer ${token[0].token}`,
          },
        }
      );
      setLocationData(response.data.data);
    };

    fetchLocation();
    fetchPersonel();
  }, []);

  const handleFileUpload = async () => {
    if (file) {
      setIsLoading("file");
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          process.env.NEXT_PUBLIC_BASE_URL + "/uploadFile",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token[0].token}`,
            },
          }
        );
        console.log(response.data.data[0]);
        setFileData((prev) => [...prev, response.data.data[0]]);
        setFileAttachment((prev) => [
          ...prev,
          response.data.data[0].idFileContainer,
        ]);
        setIsLoading(null);
        toast.success("File Uploaded");
      } catch (error) {
        console.error("Kesalahan saat mengunggah berkas:", error);
        setIsLoading(null);
        toast.error("File Upload Failed");
        throw error;
      }
    }
  };

  console.log(fileData);
  console.log(fileAttachment);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleCreateMeet = async (e) => {
    setIsLoading("meet");
    e.preventDefault();

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL + "/meet/create-meet",
        {
          meetTitle: formData.meetTitle,
          projectName: formData.projectName,
          meetDate: formData.meetDate,
          users: formData.users,
          idOfficeLocations: formData.location,
          alternativeLocation: formData.alternativeLocation,
          meetLink: formData.meetLink,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          fileAttachment: fileAttachment,
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
        setFileData([]);
        setFormData({
          meetTitle: "",
          projectName: "",
          meetDate: "",
          users: [],
          location: "",
          alternativeLocation: "",
          meetLink: "",
          customerName: "",
          customerEmail: "",
          meetReminder: null,
        });
        toast.success("Create Meet Success");
        router.push("/meeting");
      }
      if (response.data.status === 400) {
        setIsLoading(null);
        toast.error(response.data.message);
      }
    } catch (error) {
      setIsLoading(null);
      toast.error(`Create Meet Failed : ${error}`);
      console.log(error);
    }
  };

  console.log(formData);

  return (
    <div>
      <Header />
      <div className="bg-blue-50 overflow-auto">
        <div className="w-auto min-h-[100vh] m-6 mx-28 flex gap-6 ">
          <div className="flex h-max min-w-96 w-screen p-4 flex-col gap-2 bg-white rounded-lg">
            <h1 className="font-bold text-xl mb-3 text-black">
              CREATE MEETING
            </h1>

            <div className="flex flex-col justify-start gap-1">
              <label
                for="meetingTitle"
                className="text-left text-sm font-semibold"
              >
                Meeting Title
              </label>
              <input
                type="text"
                id="meetingTitle"
                name="meetingTitle"
                placeholder="Meeting Name"
                className="w-full p-1 bg-gray-50 rounded-sm"
                required
                onChange={(e) =>
                  setFormData({ ...formData, meetTitle: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col justify-start gap-1">
              <label
                htmlFor="projectName"
                className="text-left text-sm font-semibold"
              >
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                placeholder="Project Name"
                className="w-full p-1 bg-gray-50 rounded-sm"
                required
                onChange={(e) =>
                  setFormData({ ...formData, projectName: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col justify-start gap-1">
              <label
                htmlFor="meetingDate"
                className="text-left text-sm font-semibold"
              >
                Date
              </label>
              <input
                type="datetime-local"
                id="meetingDate"
                name="meetingDate"
                className="w-1/4 p-1 bg-gray-50 rounded-sm"
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

            <div className="flex flex-col justify-start gap-1">
              <label
                htmlFor="users"
                className="text-left text-sm font-semibold"
              >
                Personel
              </label>
              <Select
                name="users"
                id="users"
                className="w-full bg-gray-50 rounded-sm"
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

            <div className="flex flex-col justify-start gap-1">
              <label
                htmlFor="location"
                className="text-left text-sm font-semibold"
              >
                Location
              </label>
              <select
                name="location"
                id="location"
                className="w-full p-1 px-3 bg-gray-50 rounded-sm"
                required
                onChange={(e) =>{
                  const value = e.target.value;
                  if (value === "other") {
                    setFormData({ ...formData, location: null });
                  } else {
                    setFormData({ ...formData, location: value });
                  }
                }}
              >
                <option value={null} disabled selected>
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
                <option value="other">Other</option>
              </select>
            </div>

            {formData.location === null ? (
              <div className="flex flex-col justify-start gap-1">
              <label
                htmlFor="alternativeLocation"
                className="text-left text-sm font-semibold"
              >
                Other Location
              </label>
              <input
                type="text"
                id="alternativeLocation"
                name="alternativeLocation"
                placeholder="Other Location"
                className="w-full p-1 bg-gray-50 rounded-sm"
                onChange={(e) =>
                  setFormData({ ...formData, alternativeLocation: e.target.value })
                }
              />
            </div>
            )
            : null
            }

            {formData.location === "d56715a7-d49e-4c0d-8652-ee57b0dcd19d" ? (
              <div className="flex flex-col justify-start gap-1">
              <label
                htmlFor="meetLink"
                className="text-left text-sm font-semibold"
              >
                Meeting Link
              </label>
              <input
                type="text"
                id="meetingLink"
                name="meetingLink"
                placeholder="Meeting Link"
                className="w-full p-1 bg-gray-50 rounded-sm"
                onChange={(e) =>
                  setFormData({ ...formData, meetLink: e.target.value })
                }
              />
            </div>
            )
            : null
            }

            <div className="grid grid-cols-2 gap-2 w-full">
              <div className="flex flex-col justify-start gap-1">
                <label
                  htmlFor="customerName"
                  className="text-left text-sm font-semibold"
                >
                  Customer Name
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  placeholder="Customer Name"
                  className="w-full p-1 bg-gray-50 rounded-sm"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col justify-start gap-1">
                <label
                  htmlFor="customerEmail"
                  className="text-left text-sm font-semibold"
                >
                  Customer Email
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  name="customerEmail"
                  placeholder="Customer Email"
                  className="w-full p-1 bg-gray-50 rounded-sm"
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

            <div className="flex flex-col justify-start gap-1">
              <label
                htmlFor="meetReminder"
                className="text-left text-sm font-semibold"
              >
                Reminder
              </label>
              <input
                type="number"
                id="meetReminder"
                name="meetReminder"
                placeholder="Reminder"
                className="w-1/4 p-1 bg-gray-50 rounded-sm"
                required
                min="1"
                onChange={(e) =>
                  setFormData({ ...formData, meetReminder: e.target.value })
                }
              />
            </div>
            <div>
              <label for="uploadFile" className="font-semibold text-left ml-2">
                File
              </label>
              <div className="flex flex-row gap-2 items-center">
                <input
                  type="file"
                  id="uploadFile"
                  name="uploadFile"
                  className="w-full p-1 bg-gray-50 rounded-sm"
                  onChange={handleFileChange}
                />
                <button
                  className="p-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  onClick={handleFileUpload}
                >
                  {isLoading === "file" ? "Loading" : "Upload"}
                </button>
              </div>
              <div className="flex flex-row gap-2 items-center">
                {fileData.map((file) => (
                  <div className="flex flex-col gap-2 items-center">
                    <div className="flex flex-row gap-2 items-center">
                      <button
                        className="text-blue-500"
                        onClick={() => {
                          window.open(file.fileLink);
                        }}
                      >
                        {file.fileTitle}
                      </button>
                      <button
                        className=" text-black"
                        onClick={() => {
                          setFileData(
                            fileData.filter(
                              (f) => f.idFileContainer !== file.idFileContainer
                            )
                          );
                        }}
                      >
                        <IoIosClose />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleCreateMeet}
              className="w-max p-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              {isLoading === "meet" ? "Loading" : "Create Meet"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
