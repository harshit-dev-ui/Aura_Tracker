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
