import { employeeService, type Employee } from "../../lib/api";
import { Card, CardContent } from "../../components/ui/card";
import { Users, UserCheck, UserMinus, UserX } from "lucide-react";
import { motion } from "motion/react";
import EmployeeTable from "./_components/employee-table";
import { useEffect, useState } from "react";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // Load Employees
  // -----------------------------
  const loadEmployees = async () => {
    try {
      setLoading(true);

      const res = await employeeService.list({
        page: "1",
        pageSize: "50",
      });

      setEmployees(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // -----------------------------
  // Stats
  // -----------------------------
  const stats = [
    {
      label: "Total Employees",
      value: employees.length,
      icon: Users,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Active",
      value: employees.filter(
        (e) => e.status?.toLowerCase() === "active"
      ).length,
      icon: UserCheck,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "On Leave",
      value: employees.filter(
        (e) => e.status?.toLowerCase() === "on_leave"
      ).length,
      icon: UserMinus,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      label: "Inactive",
      value: employees.filter(
        (e) => e.status?.toLowerCase() === "inactive"
      ).length,
      icon: UserX,
      color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: i * 0.05,
            }}
          >
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${s.color}`}
                >
                  <s.icon size={18} />
                </div>

                <div>
                  <p className="text-2xl font-bold font-display">
                    {loading ? "..." : s.value}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Employee Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: 0.2,
        }}
      >
        <EmployeeTable
          employees={employees}
          loading={loading}
          onRefresh={loadEmployees}
        />
      </motion.div>
    </div>
  );
}