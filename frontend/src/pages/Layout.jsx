import React from "react";
import Navbar from "../components/Navbar";
import { Outlet, useNavigate, Navigate } from "react-router-dom";
import { store } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="p-1">
        <div className="h-screen ">
          {/* here all the children of layout displays */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
