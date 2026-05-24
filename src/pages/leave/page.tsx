import { useState, useEffect} from "react";
//import { mockLeaves } from "../../lib/mock-data.ts";
import { leaveService, type Leave} from "../../lib/api.ts";
import { Card, CardContent } from "../../components/ui/card.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import { Button } from "../../components/ui/button.tsx";
import { Avatar, AvatarFallback } from "../../components/ui/avatar.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu.tsx";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  MoreHorizontal,
  Check,
  X,
  CalendarRange,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import LeaveApplyDialog from "./_components/leave-apply-dialog.tsx";
import LeaveCalendar from "../leave/_components/leave-calender.tsx";
import { toast } from "sonner";



type View = "list" | "calendar";

export default function LeavePage() {

  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [applyOpen, setApplyOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [view, setView] = useState<View>("list");
  //const [usernam, setUserName] = useState<Employee>();
useEffect(() => {
  fetchLeaves();
}, []);

  const fetchLeaves = async () => {
  try {
    const res = await leaveService.list({
      page: "1",
      pageSize: "50",
    });

    setLeaves(res.data || []);
  } catch (err) {
    console.error(err);
  }
};
  useEffect(() => {
    leaveService.list({page: "1", pageSize: "10"})
      .then(res => { setLeaves(res.data);
         console.log(res.data);

      }

    )

      .catch(err => console.error(err));

      



  }, []);
const statusColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  cancelled: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

const leaveTypeColor: Record<string, string> = {
  annual: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  sick: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  maternity: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  paternity: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  unpaid: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  other: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
};

const summaryCards = [
  { label: "Total Requests", value: leaves.length, icon: CalendarDays, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { label: "Pending", value: leaves.filter((l) => l.status.toLowerCase() === "pending").length, icon: Clock, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { label: "Approved", value: leaves.filter((l) => l.status.toLowerCase() === "approved").length, icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { label: "Rejected", value: leaves.filter((l) => l.status.toLowerCase() === "rejected").length, icon: XCircle, color: "bg-red-500/10 text-red-600 dark:text-red-400" },
];

const leavePolicy = {
  annual: 25,
  sick: 15,
  maternity: 90,
  paternity: 14,
  unpaid: 30,
  other: 10,
};

const currentEmployeeId =
  localStorage.getItem("employeeId");

/*
  Only approved leaves
*/
const approvedLeaves = leaves.filter(
  (l) =>
    l.status?.toLowerCase() ===
      "approved" &&
    String(l.employeeId) ===
      String(currentEmployeeId)
);

const leaveBalance = Object.entries(
  leavePolicy
).map(([type, total]) => {
  const used = approvedLeaves
    .filter(
      (l) =>
        l.type?.toLowerCase() === type
    )
    .reduce(
      (sum, l) =>
        sum + Number(l.days || 0),
      0
    );

  const colors: Record<string, string> =
    {
      annual: "bg-blue-500",
      sick: "bg-rose-500",
      maternity: "bg-pink-500",
      paternity: "bg-indigo-500",
      unpaid: "bg-gray-500",
      other: "bg-teal-500",
    };

  return {
    type:
      type.charAt(0).toUpperCase() +
      type.slice(1),
    total,
    used,
    remaining: Math.max(
      total - used,
      0
    ),
    color:
      colors[type] || "bg-primary",
  };
});



  const filtered = leaves.filter((l) => {
    const matchStatus = statusFilter === "All" || l.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchType = typeFilter === "All" || l.type?.toLowerCase() === typeFilter.toLowerCase();
    return matchStatus && matchType;
  });

  const handleApprove = async (id: string) => {
  try {
    setLoadingId(id);
    await leaveService.approve(id);
    setLoadingId(null);
    // setLeaves(prev =>
    //   prev.map(l =>
    //     l.id === id ? { ...l, status: "Approved" as const } : l
    //   )
    // );

    toast.success("Leave request approved");
    await fetchLeaves();
  } catch (err) {
    console.error(err);
    toast.error("Failed to approve leave");
  }
};

 const handleReject = async (id: string) => {
  try {
    await leaveService.reject(id);

 

    toast.success("Leave request rejected");
    await fetchLeaves();
  } catch (err) {
    console.error(err);
    toast.error("Failed to reject leave");
  }
};

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${s.color}`}>
                  <s.icon size={18} />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Leave balance */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold font-display mb-4">My Leave Balance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {leaveBalance.map((lb) => {
  const pct =
    lb.total > 0
      ? Math.min(
          (lb.used / lb.total) * 100,
          100
        )
      : 0;

  return (
    <div
      key={lb.type}
      className="space-y-2"
    >
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">
          {lb.type}
        </span>

        <span className="text-muted-foreground">
          {lb.used}/{lb.total} days
        </span>
      </div>

      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full ${lb.color} transition-all duration-500`}
          style={{
            width: `${pct}%`,
          }}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        {lb.remaining} days remaining
      </p>
    </div>
  );

              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25 }}
        className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
      >
        <div className="flex gap-2">
          <Button
            variant={view === "list" ? "default" : "secondary"}
            size="sm"
            className="h-9 gap-1.5"
            onClick={() => setView("list")}
          >
            <CalendarDays size={14} /> List
          </Button>
          <Button
            variant={view === "calendar" ? "default" : "secondary"}
            size="sm"
            className="h-9 gap-1.5"
            onClick={() => setView("calendar")}
          >
            <CalendarRange size={14} /> Calendar
          </Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-36 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-9 w-36 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
              <SelectItem value="sick">Sick</SelectItem>
              <SelectItem value="maternity">Maternity</SelectItem>
              <SelectItem value="paternity">Paternity</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" className="h-9 gap-1.5 ml-auto" onClick={() => setApplyOpen(true)}>
          <PlusCircle size={14} /> Apply for Leave
        </Button>
      </motion.div>

      {/* View */}
      <AnimatePresence mode="wait">
        {view === "list" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-xl border border-border bg-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Employee</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Duration</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Reason</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((leave, i) => (
                    <motion.tr
                      key={leave.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-7 h-7 shrink-0">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                              {/* {leave.employeeName?.split(" ").map((n) => n[0]).join("")}
                            */}
                            {`${leave.employee?.firstName?.[0] ?? ""}${leave.employee?.lastName?.[0] ?? ""}`}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{leave.employee
  ? `${leave.employee?.firstName} ${leave.employee?.lastName}`
  : "Unknown User"}</p>
                            <p className="text-xs text-muted-foreground">
                              Applied {new Date(leave.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Badge className={`${leaveTypeColor[leave.type]} text-[10px] capitalize`}>
                          {leave.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-foreground">{leave.days} day{leave.days > 1 ? "s" : ""}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(leave.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
                          {new Date(leave.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <p className="text-muted-foreground truncate max-w-[180px]">{leave.reason}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`${statusColor[leave.status.toLowerCase()]} text-[10px] capitalize`}>
                          {leave.status.toLowerCase()}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {leave.status.toLowerCase() === "pending" ? (
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="w-7 h-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer"
                              onClick={() => handleApprove(leave.id)}
                              disabled={loadingId === leave.id}
                            >
                              <Check size={14} />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="w-7 h-7 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                              onClick={() => handleReject(leave.id)}
                            disabled={loadingId === leave.id}
                            >
                              <X size={14} />
                            </Button>
                          </div>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-7 h-7 cursor-pointer">
                                <MoreHorizontal size={15} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive cursor-pointer"
                                onClick={() => handleReject(leave.id)}
                              >
                                <X size={13} className="mr-2" /> Cancel Request
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground text-sm">
                        No leave requests match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <LeaveCalendar leaves={filtered} />
          </motion.div>
        )}
      </AnimatePresence>

      <LeaveApplyDialog open={applyOpen} onOpenChange={setApplyOpen} />
    </div>
  );
}
