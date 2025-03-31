import React from "react";
import { MdOutlineSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar } from "../redux/slices/authSlice";
import UserAvatar from "./UserAvatar";
import NotificationPanel from "./NotificationPanel";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="flex justify-between items-center bg-white px-4 py-3 2xl:py-4 sticky top-0 z-10 shadow-md">
      {/* Left Section - Hamburger Menu and Search Bar */}
      <div className="flex gap-4 items-center">
        <button
          onClick={() => dispatch(setOpenSidebar(true))}
          className="text-2xl text-gray-500 block md:hidden"
        >
          ☰
        </button>

        {/* Search Bar */}
        <div className="w-64 2xl:w-[400px] flex items-center py-2 px-3 gap-2 rounded-full bg-[#f3f4f6]">
          <MdOutlineSearch className="text-gray-500 text-xl" />
          <input
            type="text"
            placeholder="Search...."
            className="flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800"
          />
        </div>
      </div>

      {/* Right Section - Notifications and User Avatar */}
      <div className="flex gap-4 items-center">
        <NotificationPanel />

        {/* User Avatar */}
        <div className="relative">
          <UserAvatar />
          {/* Tooltip or User Info Popup (optional) */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
