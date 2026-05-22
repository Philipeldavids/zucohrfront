import { Link, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import { cn } from "../lib/utils";
import { jwtDecode }from 'jwt-decode';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  CreditCard,
  TrendingUp,
  Receipt,
  Briefcase,
  ClipboardList,
  Settings,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
//import { Button } from "@/components/ui/button.tsx";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
//import { useAuth } from "@/hooks/use-auth.ts";
import Image from '../assets/1777297540099.png';

const navItems = [
 { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  //{ label: "Employees", icon: Users, href: "/employees" },
  { label: "Leave", icon: CalendarDays, href: "/leave" },
  //{ label: "Payroll", icon: CreditCard, href: "/payroll" },
  { label: "Performance", icon: TrendingUp, href: "/performance" },
  { label: "Expenses", icon: Receipt, href: "/expenses" },
  //{ label: "Recruitment", icon: Briefcase, href: "/recruitment" },
  //{ label: "Onboarding", icon: ClipboardList, href: "/onboarding" },
  //{ label: "Users", icon: Users, href: "/users" },
  //{ label: "Roles", icon: ClipboardList, href: "/roles" }
];

export default function Sidebar2() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
 const [user, setUser] = useState("");
   const [email, setEmail] = useState("");
   const [company, setCompany] = useState("");
 
   useEffect(() => {
       const foundUser = JSON.parse(localStorage.getItem("user") || "{}");
       const compny = JSON.parse(localStorage.getItem("org") || "{}")
       if(foundUser){
         setUser(foundUser?.name);
         setEmail(foundUser?.email);
 
       }
       if(compny){
         setCompany(compny?.name);
       }
 
   },[])
 

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 relative",
        collapsed ? "w-16" : "w-60",
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center h-16 border-b border-sidebar-border shrink-0", collapsed ? "justify-center px-2" : "px-4")}>
        {collapsed ? (
          <img
            src= {Image}
            alt="ZucoHR"
            className="w-8 h-8 object-contain object-left"
          />
        ) : (
          <img
            src={Image}
            alt="ZucoHR"
            className="h-8 w-auto object-contain object-left"
          />
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer group",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                collapsed && "justify-center px-0",
              )}
            >
              <item.icon className={cn("shrink-0", isActive ? "text-sidebar-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground")} size={18} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {/* {item.badge !== undefined && (
                    <Badge className="bg-primary/20 text-primary text-[10px] px-1.5 py-0 h-4 font-semibold">
                      {item.badge}
                    </Badge>
                  )} */}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={cn("p-2 border-t border-sidebar-border space-y-0.5", collapsed && "flex flex-col items-center")}>
        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground cursor-pointer transition-colors",
            collapsed && "justify-center px-0",
          )}
        >
          <Settings size={18} />
          {!collapsed && <span>Settings</span>}
        </Link>

        <div className={cn("flex items-center gap-3 px-3 py-2.5 mt-2 rounded-lg", collapsed && "flex-col gap-1 px-0")}>
          <Avatar className="w-7 h-7 shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
              {user ? user.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-foreground text-xs font-semibold truncate">{email ?? "User"}</p>
              <p className="text-sidebar-foreground/40 text-[10px] truncate">{company ?? ""}</p>
            </div>
          )}
          {/* {!collapsed && (
            // <Button variant="ghost" size="icon" className="w-6 h-6 text-sidebar-foreground/40 hover:text-sidebar-foreground cursor-pointer" onClick={() => removeUser()}>
            //   <LogOut size={13} />
            // </Button>
          )} */}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border flex items-center justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground cursor-pointer transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
