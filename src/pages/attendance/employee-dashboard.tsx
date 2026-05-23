import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  attendanceService, getCurrentLocation,
  type Attendance,
} from "../../lib/api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import { Button } from "../../components/ui/button";

import { Badge } from "../../components/ui/badge";

import {
  Clock,
  Timer,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

export default function EmployeeAttendanceDashboard() {
  const [attendance, setAttendance] =
    useState<Attendance[]>([]);

  const [loading, setLoading] =
    useState(false);

  //const employeeId = "CURRENT_USER_ID";

  useEffect(() => {
    loadAttendance();
  }, []);

const loadAttendance = async () => {
  try {
    setLoading(true);

    const res =
      await attendanceService.myAttendance();

    setAttendance(res);
  } finally {
    setLoading(false);
  }
};

  const todayAttendance =
    attendance.find(
      (a) =>
        new Date(a.date).toDateString() ===
        new Date().toDateString()
    );

  const totalDays = attendance.length;

  const presentDays =
    attendance.filter(
      (a) =>
        a.status === "Present" ||
        a.status === "Late"
    ).length;

  const lateDays =
    attendance.filter(
      (a) => a.isLate
    ).length;

  const totalHours =
    attendance.reduce(
      (sum, a) => sum + a.workedMinutes,
      0
    );

  const averageHours =
    totalDays > 0
      ? totalHours / totalDays
      : 0;

  const attendanceRate =
    totalDays > 0
      ? Math.round(
          (presentDays / totalDays) * 100
        )
      : 0;

  const thisWeekHours = useMemo(() => {
    const now = new Date();

    return attendance
      .filter((a) => {
        const d = new Date(a.date);

        const diff =
          (now.getTime() - d.getTime()) /
          (1000 * 60 * 60 * 24);

        return diff <= 7;
      })
      .reduce(
        (sum, a) => sum + a.workedMinutes,
        0
      );
  }, [attendance]);

  
 const handleClockIn = async () => {
  try {
    const location =
      await getCurrentLocation();

    await attendanceService.clockIn({
      latitude:
        location.latitude,

      longitude:
        location.longitude,

      locationAddress:
        location.locationAddress,
    });

    toast.success(
      "Clocked in successfully"
    );

    loadAttendance();
  } catch (err) {
    console.error(err);

    toast.error(
      "Unable to clock in"
    );
  }
};

 const handleClockOut = async () => {
  try {
    const location =
      await getCurrentLocation();

    await attendanceService.clockOut({
      latitude:
        location.latitude,

      longitude:
        location.longitude,

      locationAddress:
        location.locationAddress,
    });

    toast.success(
      "Clocked out successfully"
    );

    loadAttendance();
  } catch (err) {
    console.error(err);

    toast.error(
      "Unable to clock out"
    );
  }
};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            My Attendance
          </h1>

          <p className="text-muted-foreground">
            Track work hours and shifts
          </p>
        </div>

        <div className="flex gap-2">
          {!todayAttendance?.clockInTime ? (
            <Button onClick={handleClockIn}>
              Clock In
            </Button>
          ) : !todayAttendance?.clockOutTime ? (
            <Button
              variant="destructive"
              onClick={handleClockOut}
            >
              Clock Out
            </Button>
          ) : (
            <Badge>
              Completed Today
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <CalendarDays size={16} />
              <p className="text-sm">
                Attendance Rate
              </p>
            </div>

            <h2 className="text-3xl font-bold">
              {attendanceRate}%
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} />
              <p className="text-sm">
                Present Days
              </p>
            </div>

            <h2 className="text-3xl font-bold">
              {presentDays}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Timer size={16} />
              <p className="text-sm">
                Avg Hours
              </p>
            </div>

            <h2 className="text-3xl font-bold">
              {averageHours.toFixed(1)}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} />
              <p className="text-sm">
                Late Days
              </p>
            </div>

            <h2 className="text-3xl font-bold">
              {lateDays}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Timer size={16} />
              <p className="text-sm">
                This Week
              </p>
            </div>

            <h2 className="text-3xl font-bold">
              {thisWeekHours.toFixed(1)}h
            </h2>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Attendance History
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {attendance.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border rounded-lg p-4"
              >
                <div>
                  <p className="font-medium">
                    {new Date(
                      item.date
                    ).toDateString()}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {item.shift?.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm">
                    In:{" "}
                    {item.clockInTime
                      ? new Date(
                          item.clockInTime
                        ).toLocaleTimeString()
                      : "-"}
                  </p>

                  <p className="text-sm">
                    Out:{" "}
                    {item.clockOutTime
                      ? new Date(
                          item.clockOutTime
                        ).toLocaleTimeString()
                      : "-"}
                  </p>
                </div>

                <div>
                  <Badge>
                    {item.status}
                  </Badge>
                </div>

                <div>
                  <p className="font-semibold">
                    {item.workedMinutes.toFixed(
                      1
                    )}
                    h
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}