import { Bell, Search, Sun, Moon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
//import { Badge } from "../components/ui/badge";
import { useState, useEffect} from "react";
import { getConnection } from "../lib/signalr";
import {notificationService, type Notification} from "../lib/api";

export default function TopBar({ title }: { title: string }) {
  const [dark, setDark] = useState(false);
const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    load();

    const start = async () => {

    const connection = getConnection();

if (connection.state === "Disconnected") {
  await connection.start();
}

      const user = JSON.parse(localStorage.getItem("user")); // store after login

      // join group
      await connection.invoke("JoinUserGroup", user.id);

      // listen for new notifications
      connection.on("ReceiveNotification", (notif) => {
        setNotifications((prev) => [notif, ...prev]);
      });
    };

    start();

    return () => {
      const connection = getConnection();
      connection.off("ReceiveNotification");
    };
  }, []);

  const load = async () => {
    const res = await notificationService.list();
    console.log(res);
    setNotifications(res);
  };

  const unread = notifications.filter(n => !n.isRead).length;
  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDark(!dark);
  };

  const markAsRead = async (id: string) => {
  try {
    await notificationService.markAsRead(id);

    // update UI instantly (no reload)
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
  } catch (err) {
    console.error(err);
  }
};

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center gap-4 shrink-0">
      <h1 className="text-lg font-bold font-display text-foreground tracking-tight flex-shrink-0">
        {title}
      </h1>
      <div className="flex-1 max-w-sm ml-4 hidden sm:block">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 h-8 text-sm bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        
       
        <Button variant="ghost" size="icon" className="w-8 h-8 relative" onClick={toggleDark}>
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </Button>
        <div className="relative">
      <Button onClick={() => setOpen(!open)}>
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {unread}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-3">
          {notifications.map(n => (
            <div key={n.id}
            onClick={() => markAsRead(n.id)} // ✅ HERE
    className={`p-2 border-b cursor-pointer ${
      n.isRead ? "bg-white" : "bg-blue-50"
    }`}>
              <p className="font-medium text-sm">{n.title}</p>
              <p className="text-xs text-gray-500">{n.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
        
          {/* <Badge className="absolute -top-0.5 -right-0.5 w-4 h-4 p-0 flex items-center justify-center text-[9px] bg-primary">
            {notifications.length}
          </Badge> */}
        
      </div>
    </header>
  );
}
