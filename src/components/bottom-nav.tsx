import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  CreditCard,
  Briefcase,
} from "lucide-react";

const navItems = [
  { label: "Home", icon: LayoutDashboard, href: "/" },
  { label: "People", icon: Users, href: "/employees" },
  { label: "Leave", icon: CalendarDays, href: "/leave" },
  { label: "Payroll", icon: CreditCard, href: "/payroll" },
  { label: "Jobs", icon: Briefcase, href: "/recruitment" },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around border-t bg-card md:hidden z-50 pb-safe">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 py-2 px-3 text-[10px] font-medium transition-colors cursor-pointer",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
