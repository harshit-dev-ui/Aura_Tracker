import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { logOut } from "../redux/slices/auth/userSlice";
import { logoutUser } from "../redux/slices/auth/apiService";
import { useDispatch } from "react-redux";
function Navbar() {
  // const [isAuthenticated, setisAuthenticatedTrue] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/mentor");
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
    <div className="flex items-center justify-between bg-gray-400 h-14 w-full px-3">
      <div className="bg-red-400">LOGO</div>
      {/* Navbar buttons */}
      <div className="flex gap-6">
        <button className="text-white hover:text-gray-300">Dashboard</button>
        <button className="text-white hover:text-gray-300">Courses</button>
        <button className="text-white hover:text-gray-300">Goals</button>
        <button className="text-white hover:text-gray-300">LeaderBoard</button>
        <button className="text-white hover:text-gray-300">Rewards</button>
      </div>
      {/* {isAuthenticated ? ( */}

      <div className="flex gap-3">
        <button className="text-[35px]" onClick={handleLogout}>
          <CiLogout />
        </button>
        <button className="text-[35px]" onClick={handleClick}>
          <FaUserCircle />
        </button>
      </div>
      {/* ) : (
        <div className="flex gap-3">
          <button
            className="text-blue-600 p-2 border border-white rounded-lg bg-white hover:text-gray-300 "
            onClick={navigate("/login")}
          >
            Login
          </button>
          <button
            className="text-white p-2 border border-blue-600 rounded-lg bg-blue-600 hover:text-gray-300"
            onClick={navigate("/signup")}
          >
            Signup
          </button>
        </div>
      )} */}
    </div>
  );
}

export default Navbar;
