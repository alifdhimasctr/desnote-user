"use client"
import React, {useEffect, useState} from "react";
import { useCookies } from "react-cookie";
import Header from "../header/header";
import axios from "axios";

export default function page() {

    const [token, setToken] = useCookies(["token"]);
    const [user, setUser] = useCookies(["user"]);
    const [department, setDepartment] = useState("");
    const data = user["user"];
    const departmentName = department.departmentName;
    const idDepartments = data.idDepartments;


    useEffect(() => {
        const fetchDepartmentById = async () => {
            const response = await axios.get(
                process.env.NEXT_PUBLIC_BASE_URL + `/department/findOne/${idDepartments}`
            );
            console.log(response.data);
            setDepartment(response.data.data);
        }  
        fetchDepartmentById();
    }, []);



return (
    <div className="overflow-auto bg-blue-50">
        <Header />
        <div className="min-h-screen">
            <div className="flex flex-col gap-2 p-10 m-10 mx-28 bg-white rounded-lg shadow-md min-w-max ">
                <div className="flex flex-row gap-8 items-center">
                    <img
                        src={data.profilePict}
                        className="h-40 w-40 rounded-full"
                        alt="profile"
                    />
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-semibold">{data?.name}</h1>
                        <p className="text-gray-500">{data.role} {department.departmentName}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-gray-800 font-semibold ml-1">Nama</label>
                        <input
                            type="text"
                            className="border-2 border-gray-200 p-2 rounded-lg"
                            disabled
                            value={data.name}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-800 font-semibold ml-1">Email</label>
                        <input
                            type="text"
                            className="border-2 border-gray-200 p-2 rounded-lg"
                            disabled
                            value={data.email}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-800 font-semibold ml-1">Username</label>
                        <input
                            type="text"
                            className="border-2 border-gray-200 p-2 rounded-lg"
                            disabled
                            value={data.username}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-800 font-semibold ml-1">Nomor Telepon</label>
                        <input
                            type="text"
                            className="border-2 border-gray-200 p-2 rounded-lg"
                            disabled
                            value={data.phone}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-800 font-semibold ml-1">Role</label>
                        <input
                            type="text"
                            className="border-2 border-gray-200 p-2 rounded-lg"
                            disabled
                            value={data.role}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-800 font-semibold ml-1">Departemen</label>
                        <input
                            type="text"
                            className="border-2 border-gray-200 p-2 rounded-lg"
                            disabled
                            value={department.departmentName}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-800 font-semibold ml-1">Status</label>
                        <a className=" p-2 px-3 bg-green-400 w-max rounded text-white ">{data.status.toUpperCase()}</a>
                    </div>
                </div>
                <button 
                onClick={() => window.location.href = "/profile/edit"}
                className="bg-blue-500 text-white p-2 px-4 rounded-lg w-max self-center mt-4">EDIT PROFILE</button>
            </div>
        </div>
    </div>
);
}
