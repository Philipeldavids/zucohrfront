import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./sidebar";
import Sidebar2 from "./sidebar2";
import {useEffect, useState} from 'react';
import TopBar from "./top-bar";
import BottomNav from "./bottom-nav";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/employees": "Employees",
  "/leave": "Leave Management",
  "/e-attendance": "Attendance",
  "/hr-attandance": "Attendance",
  "/payroll": "Payroll",
  "/performance": "Performance",
  "/expenses": "Expenses",
  "/recruitment": "Recruitment",
  "/onboarding": "Onboarding",
  "/users": "Users",
  "/roles": "Roles",
  "/settings": "Settings",
};

export default function AppLayout() {
  const location = useLocation();
  const[role, setRole] = useState("");
  const title = Object.entries(pageTitles).find(
    ([path]) => location.pathname === path || location.pathname.startsWith(path + "/")
  )?.[1] ?? "ZucoHR";
   useEffect(() => {
        const foundUser = JSON.parse(localStorage.getItem("user") || "{}");
        if(foundUser){
          setRole(foundUser?.role);
        }
      }, [])

      if(role == "Employee")
        return(
      <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar2 />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar title={title} />
        <main className="flex-1 overflow-y-auto p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
        )

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar title={title} />
        <main className="flex-1 overflow-y-auto p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
