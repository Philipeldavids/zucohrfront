import { useEffect, useMemo, useState } from "react";
import {
  employeeService,
  leaveService,
  expenseService,
  onboardingService,
  payrollService,
  type Employee,
  type Leave,
  type Expense,
  type OnboardingTask,
  type Payroll,
} from "../../lib/api";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Progress } from "../../components/ui/progress";

import {
  Users,
  UserCheck,
  UserPlus,
  CalendarOff,
  Briefcase,
  Clock,
  Receipt,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { motion } from "motion/react";

const statusColor: Record<string, string> = {
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",

  approved:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",

  rejected:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",

  active:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",

  on_leave:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",

  inactive:
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export default function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [onboardingTasks, setOnboardingTasks] = useState<
    OnboardingTask[]
  >([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [
        employeeRes,
        leaveRes,
        expenseRes,
        onboardingRes,
        payrollRes,
      ] = await Promise.all([
        employeeService.list({
          page: "1",
          pageSize: "500",
        }),

        leaveService.list({
          page: "1",
          pageSize: "500",
        }),

        expenseService.list({
          page: "1",
          pageSize: "500",
        }),

        onboardingService.list({
          page: "1",
          pageSize: "500",
        }),

        payrollService.list({
          page: "1",
          pageSize: "500",
        }),
      ]);
      console.log("Employees:", employeeRes);
console.log("Leaves:", leaveRes);
console.log("Expenses:", expenseRes);
console.log("Onboarding:", onboardingRes);
console.log("Payrolls:", payrollRes);
      setEmployees(employeeRes.data || []);
      setLeaves(leaveRes.data || []);
      setExpenses(expenseRes.data || []);
      setOnboardingTasks(onboardingRes.data || []);
      setPayrolls(payrollRes.data || []);
    } catch (error) {
      console.error("Dashboard load failed", error);
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | STATS
  |--------------------------------------------------------------------------
  */

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (e) => e.status?.toLowerCase() === "Active"
  ).length;

  const newHires = employees.filter((e) => {
    if (!e.startDate) return false;

    const startDate = new Date(e.startDate);
    const now = new Date();

    return (
      startDate.getMonth() === now.getMonth() &&
      startDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const onLeave = employees.filter(
    (e) => e.status?.toLowerCase() === "on_leave"
  ).length;

  const monthlyPayroll = payrolls.reduce(
    (sum, p) => sum + Number(p.netPay || 0),
    0
  );

  const completedTasks = onboardingTasks.filter(
    (t) => t.status?.toLowerCase() === "completed"
  ).length;

  const openTasks = onboardingTasks.filter(
    (t) => t.status?.toLowerCase() !== "completed"
  ).length;

  const onboardingProgress =
    onboardingTasks.length > 0
      ? Math.round(
          (completedTasks / onboardingTasks.length) * 100
        )
      : 0;

  const approvedExpenses = expenses.filter(
    (e) => e.status?.toLowerCase() === "approved"
  ).length;

  const expenseApprovalRate =
    expenses.length > 0
      ? Math.round(
          (approvedExpenses / expenses.length) * 100
        )
      : 0;

  const attendanceRate =
    totalEmployees > 0
      ? Math.round(
          (activeEmployees / totalEmployees) * 100
        )
      : 0;

  const avgPerformance = 82;

  /*
  |--------------------------------------------------------------------------
  | CHARTS
  |--------------------------------------------------------------------------
  */

  const headcountData = useMemo(() => {
    const now = new Date();

    return Array.from({ length: 6 }).map((_, i) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - (5 - i),
        1
      );

      const count = employees.filter((e) => {
        if (!e.startDate) return false;

        return new Date(e.startDate) <= date;
      }).length;

      return {
        month: date.toLocaleString("default", {
          month: "short",
        }),
        employees: count,
        
      };
    });
  }, [employees]);

  const deptData = useMemo(() => {
    const grouped: Record<string, number> = {};

    employees.forEach((e) => {
      const dept = e.department || "Other";

      grouped[dept] = (grouped[dept] || 0) + 1;
    });

    const colors = [
      "#3b82f6",
      "#8b5cf6",
      "#14b8a6",
      "#f97316",
      "#e11d48",
      "#06b6d4",
      "#84cc16",
    ];

    return Object.entries(grouped).map(
      ([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length],
      })
    );
  }, [employees]);

  /*
  |--------------------------------------------------------------------------
  | TABLES / PANELS
  |--------------------------------------------------------------------------
  */

  const recentLeaves = leaves.filter(
    (l) => l.status?.toLowerCase() === "pending"
  );

  const recentEmployees = [...employees]
    .sort(
      (a, b) =>
        new Date(b.startDate || "").getTime() -
        new Date(a.startDate || "").getTime()
    )
    .slice(0, 5);

  /*
  |--------------------------------------------------------------------------
  | STAT CARDS
  |--------------------------------------------------------------------------
  */

  const statCards = [
    {
      label: "Total Employees",
      value: totalEmployees,
      change: "+5%",
      up: true,
      icon: Users,
      color: "bg-blue-500/10 text-blue-600",
    },

    {
      label: "Active Employees",
      value: activeEmployees,
      change: `${attendanceRate}% active`,
      up: true,
      icon: UserCheck,
      color: "bg-emerald-500/10 text-emerald-600",
    },

    {
      label: "New Hires",
      value: newHires,
      change: "This month",
      up: true,
      icon: UserPlus,
      color: "bg-violet-500/10 text-violet-600",
    },

    {
      label: "On Leave",
      value: onLeave,
      change: `${onLeave} employees`,
      up: false,
      icon: CalendarOff,
      color: "bg-amber-500/10 text-amber-600",
    },

    {
      label: "Open Tasks",
      value: openTasks,
      change: `${completedTasks} completed`,
      up: openTasks < completedTasks,
      icon: Briefcase,
      color: "bg-rose-500/10 text-rose-600",
    },

    {
      label: "Monthly Payroll",
      value: `$${monthlyPayroll.toLocaleString()}`,
      change: "Current payroll",
      up: true,
      icon: DollarSign,
      color: "bg-teal-500/10 text-teal-600",
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
      >
        <h2 className="text-2xl font-bold font-display text-foreground">
          Good morning 👋
        </h2>

        <p className="text-muted-foreground text-sm mt-0.5">
          Here&apos;s what&apos;s happening at ZucoHR today.
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: i * 0.05,
            }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${card.color}`}
                >
                  <card.icon size={18} />
                </div>

                <p className="text-2xl font-bold font-display text-foreground">
                  {card.value}
                </p>

                <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                  {card.label}
                </p>

                <div
                  className={`flex items-center gap-0.5 mt-1 text-[11px] font-medium ${
                    card.up
                      ? "text-emerald-600"
                      : "text-rose-500"
                  }`}
                >
                  {card.up ? (
                    <ArrowUpRight size={12} />
                  ) : (
                    <ArrowDownRight size={12} />
                  )}

                  {card.change}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Headcount */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold font-display flex items-center justify-between">
                Headcount Trend

                <Badge
                  variant="secondary"
                  className="text-[10px]"
                >
                  Last 6 months
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ResponsiveContainer
                width="100%"
                height={220}
              >
                <AreaChart
                  data={headcountData}
                  margin={{
                    top: 5,
                    right: 5,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="empGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#6366f1"
                        stopOpacity={0.2}
                      />

                      <stop
                        offset="95%"
                        stopColor="#6366f1"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="employees"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fill="url(#empGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Department */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold font-display">
                Department Split
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center gap-3">
              <PieChart width={170} height={170}>
                <Pie
                  data={deptData}
                  cx={80}
                  cy={80}
                  innerRadius={45}
                  outerRadius={70}
                  dataKey="value"
                >
                  {deptData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
              </PieChart>

              <div className="w-full space-y-1.5">
                {deptData.slice(0, 5).map((d) => (
                  <div
                    key={d.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: d.color,
                        }}
                      />

                      <span className="text-muted-foreground">
                        {d.name}
                      </span>
                    </div>

                    <span className="font-semibold">
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Leave Requests */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold font-display flex items-center justify-between">
              Pending Leave Requests

              <Badge className="bg-amber-100 text-amber-700 text-[10px]">
                {recentLeaves.length} pending
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {recentLeaves.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No pending leave requests.
              </p>
            )}

            {recentLeaves.map((leave) => (
              <div
                key={leave.id}
                className="flex items-start gap-3"
              >
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                    {leave.employeeName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {leave.employeeName}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {leave.type} • {leave.days} days
                  </p>
                </div>

                <Badge
                  className={`${
                    statusColor[
                      leave.status?.toLowerCase()
                    ]
                  } text-[10px] capitalize`}
                >
                  {leave.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Employees */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold font-display">
              Recent Employees
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {recentEmployees.map((emp) => (
              <div
                key={emp.id}
                className="flex items-center gap-3"
              >
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                    {emp.firstName?.[0]}
                    {emp.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {emp.firstName} {emp.lastName}
                  </p>

                  <p className="text-xs text-muted-foreground truncate">
                    {emp.position} • {emp.department}
                  </p>
                </div>

                <Badge
                  className={`${
                    statusColor[
                      emp.status?.toLowerCase()
                    ]
                  } text-[10px] capitalize`}
                >
                  {(emp.status || "").replace("_", " ")}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Metrics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold font-display">
              Quick Metrics
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock size={11} />
                  Attendance Rate
                </span>

                <span className="font-semibold">
                  {attendanceRate}%
                </span>
              </div>

              <Progress
                value={attendanceRate}
                className="h-1.5"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground flex items-center gap-1">
                  <TrendingUp size={11} />
                  Avg Performance
                </span>

                <span className="font-semibold">
                  {avgPerformance}%
                </span>
              </div>

              <Progress
                value={avgPerformance}
                className="h-1.5"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Receipt size={11} />
                  Expenses Approved
                </span>

                <span className="font-semibold">
                  {expenseApprovalRate}%
                </span>
              </div>

              <Progress
                value={expenseApprovalRate}
                className="h-1.5"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground flex items-center gap-1">
                  <ClipboardListIcon size={11} />
                  Onboarding Done
                </span>

                <span className="font-semibold">
                  {onboardingProgress}%
                </span>
              </div>

              <Progress
                value={onboardingProgress}
                className="h-1.5"
              />
            </div>

            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Next payroll run
              </p>

              <p className="text-sm font-bold text-foreground mt-0.5">
                {new Date().toLocaleDateString()}
              </p>

              <p className="text-xs text-muted-foreground">
                ${monthlyPayroll.toLocaleString()} estimated
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ClipboardListIcon({
  size,
}: {
  size: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        width="8"
        height="4"
        x="8"
        y="2"
        rx="1"
        ry="1"
      />

      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />

      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}