import React from "react";
import { Flowbite } from "flowbite-react";
import { useCookies } from "react-cookie";

function Header() {

  const [token, setToken] = useCookies(["token"]);
  const [user, setUser] = useCookies(["user"]);
  const data = user["user"];


  return (
    <nav class="bg-white border-gray-200 dark:bg-gray-900 shadow-sm">
      <div class=" flex flex-wrap items-center justify-between p-4">
        <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/DesNetLogo.png" class="h-14" alt="Flowbite Logo" />
        </a>
        <div class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <a href="/profile" className="text-sm mr-2  md:hover:text-blue-700 md:p-0 ">{data.name}</a>
          <button
            type="button"
            class="flex text-sm rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            id="user-menu-button"
            
          >
            <img
              class="w-8 h-8 rounded-full"
              src={data.profilePict}
              alt="user photo"
            />
          </button>
          
        </div>
        <div
          class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-user"
        >
          <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a
                href="/dashboard"
                class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/schedule"
                class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Schedule
              </a>
            </li>
            <li>
              <a
                href="/meeting"
                class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Meeting
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
