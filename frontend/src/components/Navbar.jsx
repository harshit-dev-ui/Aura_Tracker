import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { logOut } from "../redux/slices/auth/userSlice";
import { logoutUser } from "../redux/slices/auth/apiService";
import { useDispatch, useSelector, useSelector } from "react-redux";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [auraPoints, setAuraPoints] = useState(0);

  useEffect(() => {
    async function fetchAuraPoints() {
      try {
        const points = await getUserAuraPoints();
        setAuraPoints(points);
      } catch (error) {
        console.error("Failed to fetch aura points:", error);
      }
    }
    fetchAuraPoints();
  }, []);

  const handleClick = () => {
    navigate("/dashboard");
  };

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response) {
        dispatch(logOut());
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-800 h-14 w-full px-6 py-2">
      {/* Logo */}
      <div className="text-white font-bold text-xl">LOGO</div>

      {/* Navbar buttons */}
      <div className="hidden md:flex gap-6">
        <button className="text-white hover:text-gray-300 transition duration-200">
          Dashboard
        </button>
        <button className="text-white hover:text-gray-300 transition duration-200">
          Courses
        </button>
        <button className="text-white hover:text-gray-300 transition duration-200">
          Goals
        </button>
        <button className="text-white hover:text-gray-300 transition duration-200">
          LeaderBoard
        </button>
        <button className="text-white hover:text-gray-300 transition duration-200">
          Rewards
        </button>
      </div>

      <div className="flex gap-3 items-center">
        {/* Logout button */}
        <div className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold text-sm">
          {`Aura Points: ${auraPoints}`}
        </div>
        <button
          className="text-white text-3xl hover:text-gray-300 transition duration-200"
          onClick={handleLogout}
        >
          <CiLogout />
        </button>
      </div>

      {/* Mobile Menu Button (hidden on large screens) */}
      <div className="md:hidden flex gap-3">
        <button
          className="text-white text-xl hover:text-gray-300 transition duration-200"
          onClick={handleLogout}
        >
          <CiLogout />
        </button>
        <button
          className="text-white text-xl hover:text-gray-300 transition duration-200"
          onClick={handleClick}
        >
          <FaUserCircle />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
