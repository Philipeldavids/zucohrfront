import { useState } from "react";
import type { Leave } from "../../../lib/api.ts";
import { Card, CardContent } from "../../../components/ui/card.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { Badge } from "../../../components/ui/badge.tsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../../lib/utils.ts";

const leaveTypeColor: Record<string, string> = {
  annual: "bg-blue-400",
  sick: "bg-rose-400",
  maternity: "bg-pink-400",
  paternity: "bg-indigo-400",
  unpaid: "bg-gray-400",
  other: "bg-teal-400",
};

type Props = { leaves: Leave[] };

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function LeaveCalendar({ leaves }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prev = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const next = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  // Build map: date string -> leaves
  const leaveMap: Record<string, Leave[]> = {};
  for (const leave of leaves) {
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split("T")[0];
      if (!leaveMap[key]) leaveMap[key] = [];
      leaveMap[key].push(leave);
    }
  }

  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => {
    if (i < firstDay) return null;
    return i - firstDay + 1;
  });

  return (
    <Card>
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold font-display">
            {MONTHS[month]} {year}
          </h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="w-8 h-8 cursor-pointer" onClick={prev}>
              <ChevronLeft size={15} />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 cursor-pointer" onClick={next}>
              <ChevronRight size={15} />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-4">
          {Object.entries(leaveTypeColor).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5 text-xs text-muted-foreground capitalize">
              <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
              {type}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">
              {d}
            </div>
          ))}
          {cells.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} />;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayLeaves = leaveMap[dateStr] ?? [];
            const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

            return (
              <div
                key={day}
                className={cn(
                  "min-h-[56px] rounded-lg p-1 border transition-colors",
                  isToday ? "border-primary/50 bg-primary/5" : "border-transparent hover:bg-muted/40",
                )}
              >
                <p className={cn(
                  "text-xs font-medium mb-1 w-5 h-5 flex items-center justify-center rounded-full",
                  isToday ? "bg-primary text-primary-foreground" : "text-foreground",
                )}>
                  {day}
                </p>
                <div className="space-y-0.5">
                  {dayLeaves.slice(0, 2).map((leave) => (
                    <div
                      key={leave.id}
                      className={`${leaveTypeColor[leave.leaveType]} rounded px-1 py-0.5`}
                      title={`${leave.employeeName} – ${leave.leaveType}`}
                    >
                      <p className="text-[9px] text-white font-medium truncate leading-tight">
                        {leave.employeeName?.split(" ")[0]}
                      </p>
                    </div>
                  ))}
                  {dayLeaves.length > 2 && (
                    <Badge className="text-[9px] px-1 h-3.5 bg-muted text-muted-foreground">
                      +{dayLeaves.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
