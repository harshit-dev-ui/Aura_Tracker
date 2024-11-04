import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
function Layout() {
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
