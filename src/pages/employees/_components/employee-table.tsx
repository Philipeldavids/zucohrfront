import { useState } from "react";
import { employeeService, type Employee } from "../../../lib/api.ts";
import { Badge } from "../../../components/ui/badge.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar.tsx";
import { Input } from "../../../components/ui/input.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select.tsx";
import {
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  UserPlus,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

import EmployeeDialog from "./employee-dialog.tsx";
import EmployeeDetailSheet from "./employee-detail-sheet.tsx";

const statusColor: Record<string, string> = {
  active:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  on_leave:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  inactive:
    "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};
type Props = {
  employees: Employee[];
  loading: boolean;
  onRefresh: () => Promise<void>;
};

export default function EmployeeTable({
  employees,
  loading,
  onRefresh,
}: Props) {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");
  const [status, setStatus] = useState("All");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);

  //const [employees, setEmployees] = useState<Employee[]>([]);
  //const [loading, setLoading] = useState(false);

  // const loadEmployees = async () => {
  //   try {
  //     setLoading(true);

  //     const res = await employeeService.list({
  //       page: "1",
  //       pageSize: "100",
  //     });

  //     setEmployees(res.data ?? []);
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to load employees");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   loadEmployees();
  // }, []);

  // Dynamic departments from API
  const departments = [
    "All",
    ...Array.from(
      new Set(
        employees
          .map((e) => e.department)
          .filter(Boolean)
      )
    ),
  ];

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();

    const fullName =
      `${e.firstName ?? ""} ${e.lastName ?? ""}`.toLowerCase();

    const matchSearch =
      !q ||
      fullName.includes(q) ||
      e.email?.toLowerCase().includes(q) ||
      e.position?.toLowerCase().includes(q);

    const matchDept =
      dept === "All" || e.department === dept;

    const matchStatus =
      status === "All" || e.status === status;

    return matchSearch && matchDept && matchStatus;
  });
 
  const handleEdit = (emp: Employee) => {
    setEditEmployee(emp);
    setDialogOpen(true);
  
  };

  const handleAdd = () => {
    setEditEmployee(null);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {

     const confirmed = window.confirm(
    "Delete this expense?"
  );

  if (!confirmed) return;
    try {
      await employeeService.delete(id);

     await onRefresh();

      toast.success("Employee removed successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove employee");
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            placeholder="Search employees..."
            className="pl-9 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select value={dept} onValueChange={setDept}>
            <SelectTrigger className="h-9 w-40 text-sm">
              <Filter
                size={13}
                className="mr-1 text-muted-foreground"
              />
              <SelectValue placeholder="Department" />
            </SelectTrigger>

            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-36 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on_leave">On Leave</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Button
            size="sm"
            className="h-9 gap-1.5"
            onClick={handleAdd}
          >
            <UserPlus size={14} />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        Showing{" "}
        <span className="font-semibold text-foreground">
          {filtered.length}
        </span>{" "}
        of {employees.length} employees
      </p>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Employee
                </th>

                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                  Department
                </th>

                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                  Location
                </th>

                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                  Start Date
                </th>

                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden xl:table-cell">
                  Salary
                </th>

                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Status
                </th>

                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {filtered.map((emp, i) => (
                  <motion.tr
                    key={emp.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: i * 0.03,
                    }}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                            {emp.firstName?.[0] ?? ""}
                            {emp.lastName?.[0] ?? ""}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <button
                            onClick={() => setViewEmployee(emp)}
                            className="font-medium text-foreground hover:text-primary cursor-pointer transition-colors text-left"
                          >
                            {emp.firstName} {emp.lastName}
                          </button>

                          <p className="text-xs text-muted-foreground">
                            {emp.position}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {emp.department ?? "—"}
                    </td>

                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {emp.location ?? "—"}
                    </td>

                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {emp.startDate
                        ? new Date(emp.startDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "—"}
                    </td>

                    <td className="px-4 py-3 font-medium hidden xl:table-cell">
                      ₦
                      {Number(
                        emp.basicSalary ?? 0
                      ).toLocaleString()}
                    </td>

                    <td className="px-4 py-3">
                      <Badge
                        className={`${
                          statusColor[emp.status]
                        } text-[10px] capitalize`}
                      >
                        {emp.status?.replace("_", " ")}
                      </Badge>
                    </td>

                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7 cursor-pointer"
                          >
                            <MoreHorizontal size={15} />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              setViewEmployee(emp)
                            }
                            className="cursor-pointer"
                          >
                            <Eye size={13} className="mr-2" />
                            View Profile
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleEdit(emp)}
                            className="cursor-pointer"
                          >
                            <Pencil
                              size={13}
                              className="mr-2"
                            />
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-destructive cursor-pointer"
                            onClick={() =>
                              handleDelete(emp.id)
                            }
                          >
                            <Trash2
                              size={13}
                              className="mr-2"
                            />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>

              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-muted-foreground text-sm"
                  >
                    No employees found matching your filters.
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-muted-foreground text-sm"
                  >
                    Loading employees...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EmployeeDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

        
        }}
        employee={editEmployee}
      />

      <EmployeeDetailSheet
        employee={viewEmployee}
        onClose={() => setViewEmployee(null)}
      />
    </div>
  );
}