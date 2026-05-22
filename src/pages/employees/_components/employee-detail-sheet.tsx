import type { Employee } from "../../../lib/api.ts";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet.tsx";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar.tsx";
import { Badge } from "../../../components/ui/badge.tsx";
import { Separator } from "../../../components/ui/separator.tsx";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  Calendar,
  DollarSign,
  TrendingUp,
  CalendarDays,
  Receipt,
} from "lucide-react";

const statusColor: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  on_leave: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  inactive: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

type Props = {
  employee: Employee | null;
  onClose: () => void;
};

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={13} className="text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

const mockStats = [
  { icon: CalendarDays, label: "Leave Days Used", value: "12 / 25 days" },
  { icon: TrendingUp, label: "Performance Score", value: "4.2 / 5.0" },
  { icon: Receipt, label: "Expenses (YTD)", value: "$1,240" },
];

export default function EmployeeDetailSheet({ employee, onClose }: Props) {
  if (!employee) return null;
console.log(employee);
  const tenure = (() => {
    const start = new Date(employee.startDate);
    const now = new Date();
    const years = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
    return years === 0 ? "< 1 year" : `${years} year${years > 1 ? "s" : ""}`;
  })();

  return (
    <Sheet open={!!employee} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display">Employee Profile</SheetTitle>
        </SheetHeader>

        {/* Header card */}
        <div className="mt-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 p-5 flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
              {employee.firstName?.[0] ?? ""}{employee.lastName?.[0] ?? ""}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-bold font-display">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">{employee.position}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge className={`${statusColor[employee.status]} text-[10px] capitalize`}>
                {employee.status.replace("_", " ")}
              </Badge>
              <span className="text-xs text-muted-foreground">{tenure} tenure</span>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="mt-5 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contact</h4>
          <InfoRow icon={Mail} label="Email" value={employee.email} />
          {employee.phoneNumber && <InfoRow icon={Phone} label="Phone" value={employee.phoneNumber} />}
          {employee.location && <InfoRow icon={MapPin} label="Location" value={employee.location} />}
        </div>

        <Separator className="my-4" />

        {/* Employment info */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Employment</h4>
          <InfoRow icon={Building2} label="Department" value={employee.department} />
          <InfoRow icon={Briefcase} label="Position" value={employee.position} />
          <InfoRow icon={Calendar} label="Start Date" value={new Date(employee.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
          <InfoRow icon={DollarSign} label="Annual Salary" value={`$${employee.basicSalary?.toLocaleString?.()}`} />
        </div>

        <Separator className="my-4" />

        {/* Quick stats */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Quick Stats</h4>
          <div className="grid grid-cols-1 gap-2">
            {mockStats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon size={13} />
                  {label}
                </div>
                <span className="text-sm font-semibold text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
