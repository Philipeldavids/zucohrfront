import { useEffect, useMemo, useState } from "react";

import {
  attendanceService,
  type Attendance,
} from "../../lib/api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import { Badge } from "../../components/ui/badge";

import { Progress } from "../../components/ui/progress";

import {
  Users,
  Clock,
  TrendingUp,
  Timer,
  MapPin,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

import { motion } from "motion/react";

export default function HRAttendanceDashboard() {
  const [attendance, setAttendance] =
    useState<Attendance[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
  try {
  setLoading(true);

  const res =
    await attendanceService.all();

  setAttendance(res || []);
} catch (err) {
  console.error(err);
} finally {
  setLoading(false);
}
  };

  /*
    =========================
    ANALYTICS
    =========================
  */

  const totalEmployees = useMemo(() => {
    return new Set(
      attendance.map((a) => a.employeeId)
    ).size;
  }, [attendance]);

  const todayAttendance = useMemo(() => {
    return attendance.filter(
      (a) =>
        new Date(a.date).toDateString() ===
        new Date().toDateString()
    );
  }, [attendance]);

  const presentToday =
    todayAttendance.filter(
      (a) =>
        a.status === "Present" ||
        a.status === "Late"
    ).length;

  const absentToday =
    totalEmployees - presentToday;

  const lateToday =
    todayAttendance.filter(
      (a) => a.isLate
    ).length;

  const attendanceRate =
    totalEmployees > 0
      ? Math.round(
          (presentToday / totalEmployees) *
            100
        )
      : 0;

  const averageHours =
  attendance.length > 0
    ? (
        attendance.reduce(
          (sum, a) =>
            sum + (a.workedMinutes || 0),
          0
        ) /
        attendance.length /
        60
      ).toFixed(1)
    : "0";
  

  const departmentStats = useMemo(() => {
    const grouped: Record<
      string,
      number
    > = {};

    attendance.forEach((a) => {
      const dept =
        a.employee?.department ||
        "Other";

      grouped[dept] =
        (grouped[dept] || 0) + 1;
    });

    const colors = [
      "#3b82f6",
      "#8b5cf6",
      "#14b8a6",
      "#f97316",
      "#e11d48",
    ];

    return Object.entries(grouped).map(
      ([name, value], index) => ({
        name,
        value,
        color:
          colors[index % colors.length],
      })
    );
  }, [attendance]);

  const weeklyTrend = useMemo(() => {
  const now = new Date();

  return Array.from({ length: 7 }).map(
    (_, index) => {
      const date = new Date();

      date.setDate(
        now.getDate() - (6 - index)
      );

      const count = attendance.filter(
        (a) => {
          const d = new Date(a.date);

          return (
            d.toDateString() ===
              date.toDateString() &&
            (a.status === "Present" ||
              a.status === "Late")
          );
        }
      ).length;

      return {
        day: date.toLocaleDateString(
          "en-US",
          {
            weekday: "short",
          }
        ),
        attendance: count,
      };
    }
  );
}, [attendance]);

 const lateEmployees = useMemo(() => {
  return attendance
    .filter(
      (a) =>
        a.isLate &&
        new Date(a.date).toDateString() ===
          new Date().toDateString()
    )
    .slice(0, 5);
}, [attendance]);

  const locationStats = useMemo(() => {
    const grouped: Record<
      string,
      number
    > = {};

    attendance.forEach((a) => {
      const location =
        a.locationAddress ||
        "Unknown";

      grouped[location] =
        (grouped[location] || 0) + 1;
    });

    return Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [attendance]);

  if (loading) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Loading attendance analytics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <motion.div
        initial={{
          opacity: 0,
          y: -10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >
        <h1 className="text-2xl font-bold">
          Attendance Analytics
        </h1>

        <p className="text-muted-foreground">
          Monitor workforce attendance,
          punctuality and productivity.
        </p>
      </motion.div>

      {/* KPI CARDS */}

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <AnalyticsCard
          label="Employees"
          value={totalEmployees}
          icon={Users}
        />

        <AnalyticsCard
          label="Present Today"
          value={presentToday}
          icon={CheckCircle2}
        />

        <AnalyticsCard
          label="Absent Today"
          value={absentToday}
          icon={AlertTriangle}
        />

        <AnalyticsCard
          label="Late Today"
          value={lateToday}
          icon={Clock}
        />

        <AnalyticsCard
          label="Attendance Rate"
          value={`${attendanceRate}%`}
          icon={TrendingUp}
        />

        <AnalyticsCard
          label="Avg Hours"
          value={`${averageHours}h`}
          icon={Timer}
        />
      </div>

      {/* CHARTS */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Trend */}

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Weekly Attendance Trend
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer
              width="100%"
              height={280}
            >
              <AreaChart
                data={weeklyTrend}
              >
                <defs>
                  <linearGradient
                    id="attendance"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#8b5cf6"
                      stopOpacity={0.3}
                    />

                    <stop
                      offset="95%"
                      stopColor="#8b5cf6"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="day" />

                <YAxis />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="attendance"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#attendance)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}

        <Card>
          <CardHeader>
            <CardTitle>
              Department Attendance
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col items-center">
            <PieChart
              width={220}
              height={220}
            >
              <Pie
                data={departmentStats}
                dataKey="value"
                cx={110}
                cy={110}
                innerRadius={50}
                outerRadius={80}
              >
                {departmentStats.map(
                  (entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.color}
                    />
                  )
                )}
              </Pie>
            </PieChart>

            <div className="w-full space-y-2 mt-2">
              {departmentStats.map((d) => (
                <div
                  key={d.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          d.color,
                      }}
                    />

                    <span>{d.name}</span>
                  </div>

                  <span className="font-semibold">
                    {d.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECOND ROW */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LATE EMPLOYEES */}

        <Card>
          <CardHeader>
            <CardTitle>
              Frequently Late Employees
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {lateEmployees.map((emp) => (
              <div
                key={emp.id}
                className="flex items-center justify-between border rounded-lg p-3"
              >
                <div>
                  <p className="font-medium">
                    {
                      emp.employee
                        ?.firstName
                    }{" "}
                    {
                      emp.employee
                        ?.lastName
                    }
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {
                      emp.employee
                        ?.department
                    }
                  </p>
                </div>

                <Badge variant="destructive">
                  Late
                </Badge>
              </div>
            ))}

            {lateEmployees.length ===
              0 && (
              <p className="text-sm text-muted-foreground">
                No late employees today.
              </p>
            )}
          </CardContent>
        </Card>

        {/* LOCATION ANALYTICS */}

        <Card>
          <CardHeader>
            <CardTitle>
              Attendance Locations
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {locationStats.map(
              ([location, count]) => {
                const pct =
  attendance.length > 0
    ? Math.round(
        (count / attendance.length) * 100
      )
    : 0;

                return (
                  <div
                    key={location}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />

                        <span className="truncate max-w-[240px]">
                          {location}
                        </span>
                      </div>

                      <span className="font-semibold">
                        {count}
                      </span>
                    </div>

                    <Progress
                      value={pct}
                    />
                  </div>
                );
              }
            )}
          </CardContent>
        </Card>
      </div>

      {/* ATTENDANCE TABLE */}

      <Card>
        <CardHeader>
          <CardTitle>
            Attendance Records
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left p-4">
                    Employee
                  </th>

                  <th className="text-left p-4">
                    Department
                  </th>

                  <th className="text-left p-4">
                    Clock In
                  </th>

                  <th className="text-left p-4">
                    Clock Out
                  </th>

                  <th className="text-left p-4">
                    Hours
                  </th>

                  <th className="text-left p-4">
                    Location
                  </th>

                  <th className="text-left p-4">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
              {[...attendance]
  .sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  )
  .map((item) => (
   
    <tr
                    key={item.id}
                    className="border-b"
                  >
                    <td className="p-4">
                      {
                        item.employee
                          ?.firstName
                      }{" "}
                      {
                        item.employee
                          ?.lastName
                      }
                    </td>

                    <td className="p-4">
                      {
                        item.employee
                          ?.department
                      }
                    </td>

                    <td className="p-4">
                      {item.clockInTime
                        ? new Date(
                            item.clockInTime
                          ).toLocaleTimeString()
                        : "-"}
                    </td>

                    <td className="p-4">
                      {item.clockOutTime
                        ? new Date(
                            item.clockOutTime
                          ).toLocaleTimeString()
                        : "-"}
                    </td>

                    <td className="p-4">
                     {((item.workedMinutes || 0) / 60).toFixed(1)}h
                    </td>

                    <td className="p-4 max-w-[220px] truncate">
                      {
                        item.locationAddress
                      }
                    </td>

                    <td className="p-4">
                      <Badge>
                        {item.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: any;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">
            {label}
          </p>

          <Icon size={16} />
        </div>

        <h2 className="text-3xl font-bold">
          {value}
        </h2>
      </CardContent>
    </Card>
  );
}