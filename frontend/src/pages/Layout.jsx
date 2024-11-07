import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Outlet, useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../redux/slices/auth/apiService";

function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuthValid = await dispatch(checkAuth());
      if (!isAuthValid) {
        navigate("/login");
      }
    };
    verifyAuth();
  }, [dispatch, navigate]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="flex-grow p-1 overflow-hidden">
        {/* here all the children of layout display without scroll */}
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
