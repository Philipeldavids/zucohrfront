import { useEffect, useMemo, useState } from "react";
import { formatMoney } from "../../lib/currency";
import Papa from "papaparse";
import { type Payroll, payrollService } from "../../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import EditPayrollDialog from "./_components/edit-payroll-dialog.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  DollarSign,
  TrendingUp,
  Users,
  Download,
  PlayCircle,
  MoreHorizontal,
  Eye,
  FileText,
  ArrowUpRight,
  Minus,
  Plus,
  RefreshCcw,
} from "lucide-react";
import { motion } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PayslipSheet from "./_components/payslip-sheet.tsx";
import RunPayrollDialog from "./_components/run-payroll-dialog.tsx";
import { toast } from "sonner";

const statusColor: Record<string, string> = {
  draft:
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  processed:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  paid:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];



export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(false);
const [editingPayroll, setEditingPayroll] =
  useState<Payroll | null>(null);
  const [monthFilter, setMonthFilter] =
  useState("");

const [yearFilter, setYearFilter] =
  useState("");

  const [viewPayslip, setViewPayslip] =
    useState<Payroll | null>(null);

  const [runOpen, setRunOpen] = useState(false);


  const YEARS = useMemo(() => {
  return Array.from(
    new Set(
      payrolls.map((p) =>
        String(
          p.payRun?.year || p.year
        )
      )
    )
  ).sort((a, b) => Number(b) - Number(a));
}, [payrolls]);

const exportPayrollCsv = async () => {
  try {
    const res = await payrollService.list({
      page: "1",
      pageSize: "5000",
    });

    const payrolls = res.data || [];

    if (payrolls.length === 0) {
      toast.error("No payroll data found");
      return;
    }

    const csvData = payrolls.map((p: any) => ({
      Employee:
        p.employee
          ? `${p.employee.firstName} ${p.employee.lastName}`
          : "N/A",

      EmployeeNumber:
        p.employee?.employeeNumber || "",

      Department:
        p.employee?.department || "",

      Position:
        p.employee?.position || "",

      BasicSalary:
        p.basicSalary || 0,

      Allowance:
        p.allowance || 0,

      GrossPay:
        p.grossPay || 0,

      Tax:
        p.tax || 0,

      Pension:
        p.pension || 0,

      Deductions:
        p.totalDeductions || 0,

      NetPay:
        p.netPay || 0,

      PayrollMonth:
        p.payRun.month || "",

      PayrollYear:
        p.payRun.year || "",

      Status:
        p.payRun.status || "",

      CreatedAt: p.createdAt
        ? new Date(p.createdAt).toLocaleDateString()
        : "",
    }));

    const csv = Papa.unparse(csvData);

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      `zucohr-payroll-${new Date().toISOString().split("T")[0]}.csv`
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    toast.success("Payroll CSV exported");
  } catch (err) {
    console.error(err);
    toast.error("Failed to export payroll");
  }
};
  // ======================
  // LOAD PAYROLLS
  // ======================

  const loadPayrolls = async () => {
  try {
    setLoading(true);

    const res = await payrollService.list({
      page: "1",
      pageSize: "100",
    });

    const payrollData = res.data || [];

    setPayrolls(payrollData);

    // =========================
    // AUTO SELECT MOST RECENT
    // =========================

    if (payrollData.length > 0) {
      const sorted = [...payrollData].sort(
        (a, b) => {
          const aDate = new Date(
            Number(a.payRun?.year || a.year),
            MONTHS.indexOf(
              a.payRun?.month || a.month
            )
          );

          const bDate = new Date(
            Number(b.payRun?.year || b.year),
            MONTHS.indexOf(
              b.payRun?.month || b.month
            )
          );

          return (
            bDate.getTime() -
            aDate.getTime()
          );
        }
      );

      const latest = sorted[0];

      setMonthFilter(
        latest.payRun?.month ||
          latest.month
      );

      setYearFilter(
        String(
          latest.payRun?.year ||
            latest.year
        )
      );
    }
  } catch (err) {
    console.error(err);

    toast.error(
      "Failed to load payroll records"
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadPayrolls();
  }, []);

  // ======================
  // FILTERED DATA
  // ======================

  const filtered = useMemo(() => {
    return payrolls.filter((p) => {
      const payrollMonth =
        p.payRun?.month || p.month;

      const payrollYear =
        String(p.payRun?.year || p.year);

      return (
        payrollMonth === monthFilter &&
        payrollYear === yearFilter
      );
    });
  }, [payrolls, monthFilter, yearFilter]);

  // ======================
  // TOTALS
  // ======================

  const totalGross = filtered.reduce(
    (s, p) =>
      s +
      Number(p.basicSalary || 0) +
      Number(p.allowances || 0),
    0
  );

  const totalDeductions = filtered.reduce(
    (s, p) =>
      s + Number(p.totalDeductions || 0),
    0
  );

  const totalNet = filtered.reduce(
    (s, p) => s + Number(p.netPay || 0),
    0
  );

  // ======================
  // MONTHLY TREND
  // ======================

  const monthlyTrend = useMemo(() => {
    return MONTHS.map((month) => {
      const total = payrolls
        .filter(
          (p) =>
            (p.payRun?.month || p.month) === month &&
            String(
              p.payRun?.year || p.year
            ) === yearFilter
        )
        .reduce(
          (sum, p) => sum + Number(p.netPay || 0),
          0
        );

      return {
        month: month.slice(0, 3),
        total,
      };
    });
  }, [payrolls, yearFilter]);

  // ======================
  // SUMMARY CARDS
  // ======================

  const summaryCards = [
    {
      label: "Total Payroll",
      value: formatMoney(totalNet),
      sub: `${filtered.length} employees`,
      icon: DollarSign,
      color:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      trend: `${monthFilter} ${yearFilter}`,
    },
    {
      label: "Gross Pay",
      value: formatMoney(totalGross),
      sub: "Before deductions",
      icon: TrendingUp,
      color:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      trend: "Payroll total",
    },
    {
      label: "Total Deductions",
      value: formatMoney(totalDeductions),
      sub: "Tax & benefits",
      icon: Minus,
      color:
        "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      trend: "All deductions",
    },
    {
      label: "Employees Paid",
      value: String(
        filtered.filter(
          (p) => p.payRun?.status === "Paid"
        ).length
      ),
      sub: `of ${filtered.length} processed`,
      icon: Users,
      color:
        "bg-violet-500/10 text-violet-600 dark:text-violet-400",
      trend: "Completed",
    },
  ];
  const handleEditPayroll = (
  payroll: Payroll
) => {
  setEditingPayroll(payroll);
};

  const handleMarkAsPaid = async (
  payroll: Payroll
) => {
  try {
    await payrollService.updateStatus(
      payroll.id,
      "Paid"
    );

    toast.success(
      "Payroll marked as paid"
    );

    loadPayrolls();
  } catch (err) {
    console.error(err);

    toast.error(
      "Failed to update payroll"
    );
  }
};
const handleProcessPayroll = async (
  payroll: Payroll
) => {
  try {
    await payrollService.updateStatus(
      payroll.id,
      "Processed"
    );

    toast.success(
      "Payroll processed"
    );

    loadPayrolls();
  } catch (err) {
    console.error(err);

    toast.error(
      "Failed to process payroll"
    );
  }
};
  const handleDownloadPayslip = async (
  payroll: Payroll
) => {
  try {
    const blob =
      await payrollService.downloadPayslip(
        payroll.id
      );

    const url =
      window.URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download = `Payslip-${payroll.employee?.firstName}-${payroll.payRun?.month}.pdf`;

    a.click();

    window.URL.revokeObjectURL(url);

    toast.success("Payslip downloaded");
  } catch (err) {
    console.error(err);

    toast.error(
      "Failed to download payslip"
    );
  }
};
  return (
    <div className="space-y-5">
      {/* SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((s, i) => (
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
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}
                  >
                    <s.icon size={17} />
                  </div>

                  <span className="flex items-center gap-0.5 text-[11px] font-medium text-emerald-600">
                    <ArrowUpRight size={12} />
                    {s.trend}
                  </span>
                </div>

                <p className="text-2xl font-bold font-display">
                  {s.value}
                </p>

                <p className="text-xs text-muted-foreground mt-0.5">
                  {s.label}
                </p>

                <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                  {s.sub}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.2,
          }}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold font-display flex justify-between items-center">
                Payroll Trend

                <Badge
                  variant="secondary"
                  className="text-[10px]"
                >
                  {yearFilter}
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ResponsiveContainer
                width="100%"
                height={220}
              >
                <BarChart
                  data={monthlyTrend}
                  margin={{
                    top: 4,
                    right: 4,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) =>
                      `${formatMoney(v / 1000)}k`
                    }
                  />

                  <Tooltip
  formatter={(value) => [
    formatMoney(Number(value || 0)),
    "Payroll",
  ]}
/>

                  <Bar
                    dataKey="total"
                    fill="oklch(0.48 0.2 264)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* BREAKDOWN */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.25,
          }}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold font-display">
                Pay Breakdown
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {[
                {
                  label: "Basic Salary",
                  value: filtered.reduce(
                    (s, p) =>
                      s +
                      Number(
                        p.basicSalary || 0
                      ),
                    0
                  ),
                  color: "bg-blue-500",
                },
                {
                  label: "Allowances",
                  value: filtered.reduce(
                    (s, p) =>
                      s +
                      Number(
                        p.allowances || 0
                      ),
                    0
                  ),
                  color: "bg-emerald-500",
                },
                {
                  label: "Deductions",
                  value:
                    -filtered.reduce(
                      (s, p) =>
                        s +
                        Number(
                          p.totalDeductions ||
                            0
                        ),
                      0
                    ),
                  color: "bg-rose-500",
                },
                {
                  label: "Net Pay",
                  value: totalNet,
                  color: "bg-violet-500",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${item.color}`}
                      />

                      {item.label}
                    </span>

                    <span
                      className={`font-semibold ${
                        item.value < 0
                          ? "text-rose-600"
                          : "text-foreground"
                      }`}
                    >
                      {item.value < 0
                        ? "-"
                        : ""}
                      {formatMoney(
                        Math.abs(item.value)
                      )}
                    </span>
                  </div>

                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{
                        width: `${
                          totalGross > 0
                            ? (Math.abs(
                                item.value
                              ) /
                                totalGross) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t mt-2">
                <p className="text-xs text-muted-foreground">
                  Current Payroll Cycle
                </p>

                <p className="text-sm font-bold text-foreground">
                  {monthFilter} {yearFilter}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* TOOLBAR */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.35,
          delay: 0.3,
        }}
        className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
      >
        <div className="flex gap-2">
          <Select
            value={monthFilter}
            onValueChange={setMonthFilter}
          >
            <SelectTrigger className="h-9 w-36 text-sm">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem
                  key={m}
                  value={m}
                >
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={yearFilter}
            onValueChange={setYearFilter}
          >
            <SelectTrigger className="h-9 w-24 text-sm">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem
                  key={y}
                  value={y}
                >
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5"
            onClick={loadPayrolls}
            disabled={loading}
          >
            <RefreshCcw size={14} />
            Refresh
          </Button>

          <Button
  onClick={exportPayrollCsv}
  className="gap-2"
>
  <Download size={16} />
  Export CSV
</Button>

          <Button
            size="sm"
            className="h-9 gap-1.5"
            onClick={() => setRunOpen(true)}
          >
            <PlayCircle size={14} />
            Run Payroll
          </Button>
        </div>
      </motion.div>

      {/* TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: 0.35,
        }}
        className="rounded-xl border border-border bg-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Employee
                </th>

                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                  Basic
                </th>

                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                  <span className="flex items-center justify-end gap-1">
                    <Plus size={10} />
                    Allowances
                  </span>
                </th>

                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                  <span className="flex items-center justify-end gap-1">
                    <Minus size={10} />
                    Deductions
                  </span>
                </th>

                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Net Pay
                </th>

                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                  Status
                </th>

                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>

            <tbody>
              {filtered.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: i * 0.04,
                  }}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                          {p.employee?.firstName?.[0]}
                          {p.employee?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="font-medium text-foreground">
                          {p.employee?.firstName}{" "}
                          {p.employee?.lastName}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {p.payRun?.month ||
                            p.month}{" "}
                          {p.payRun?.year ||
                            p.year}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right tabular-nums hidden sm:table-cell">
                    {formatMoney(
                      p.basicSalary || 0
                    )}
                  </td>

                  <td className="px-4 py-3 text-right tabular-nums text-emerald-600 hidden md:table-cell">
                    +
                    {formatMoney(
                      p.allowances || 0
                    )}
                  </td>

                  <td className="px-4 py-3 text-right tabular-nums text-rose-500 hidden md:table-cell">
                    -
                    {formatMoney(
                      p.totalDeductions || 0
                    )}
                  </td>

                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-foreground">
                    {formatMoney(
                      p.netPay || 0
                    )}
                  </td>

                  <td className="px-4 py-3 hidden lg:table-cell">
                    <Badge
                      className={`${
                        statusColor[
                          p.payRun?.status ||
                            "draft"
                        ]
                      } text-[10px] capitalize`}
                    >
                      {p.payRun?.status ||
                        "draft"}
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
                          <MoreHorizontal
                            size={15}
                          />
                        </Button>
                      </DropdownMenuTrigger>

                     <DropdownMenuContent align="end">
  <DropdownMenuItem
    className="cursor-pointer"
    onClick={() => setViewPayslip(p)}
  >
    <Eye size={13} className="mr-2" />
    View Payslip
  </DropdownMenuItem>

  <DropdownMenuItem
    className="cursor-pointer"
    onClick={() => handleDownloadPayslip(p)}
  >
    <FileText size={13} className="mr-2" />
    Download PDF
  </DropdownMenuItem>

  {(p.payRun?.status === "Draft" ||
    p.payRun?.status === "Processed") && (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={() => handleEditPayroll(p)}
    >
      Edit Payroll
    </DropdownMenuItem>
  )}

  {p.payRun?.status === "Draft" && (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={() => handleProcessPayroll(p)}
    >
      Process Payroll
    </DropdownMenuItem>
  )}

  {p.payRun?.status === "Processed" && (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={() => handleMarkAsPaid(p)}
    >
      Mark as Paid
    </DropdownMenuItem>
  )}
</DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-muted-foreground text-sm"
                  >
                    {loading
                      ? "Loading payroll records..."
                      : `No payroll records for ${monthFilter} ${yearFilter}.`}
                  </td>
                </tr>
              )}
            </tbody>

            {filtered.length > 0 && (
              <tfoot>
                <tr className="border-t border-border bg-muted/30">
                  <td
                    className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase"
                    colSpan={1}
                  >
                    Totals (
                    {filtered.length} employees)
                  </td>

                  <td className="px-4 py-3 text-right tabular-nums text-sm font-semibold hidden sm:table-cell">
                    {formatMoney(
                      filtered.reduce(
                        (s, p) =>
                          s +
                          Number(
                            p.basicSalary || 0
                          ),
                        0
                      )
                    )}
                  </td>

                  <td className="px-4 py-3 text-right tabular-nums text-sm font-semibold text-emerald-600 hidden md:table-cell">
                    +
                    {formatMoney(
                      filtered.reduce(
                        (s, p) =>
                          s +
                          Number(
                            p.allowances || 0
                          ),
                        0
                      )
                    )}
                  </td>

                  <td className="px-4 py-3 text-right tabular-nums text-sm font-semibold text-rose-500 hidden md:table-cell">
                    -
                    {formatMoney(
                      filtered.reduce(
                        (s, p) =>
                          s +
                          Number(
                            p.totalDeductions ||
                              0
                          ),
                        0
                      )
                    )}
                  </td>

                  <td className="px-4 py-3 text-right tabular-nums text-sm font-bold text-foreground">
                    {formatMoney(totalNet)}
                  </td>

                  <td colSpan={2} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </motion.div>

      <PayslipSheet
        payroll={viewPayslip}
        onClose={() => setViewPayslip(null)}
      />
      <EditPayrollDialog
  payroll={editingPayroll}
  open={!!editingPayroll}
  onOpenChange={(open) => {
    if (!open) {
      setEditingPayroll(null);
    }
  }}
  onSuccess={loadPayrolls}
/>
      <RunPayrollDialog
        open={runOpen}
        onOpenChange={(open) => {
          setRunOpen(open);

          if (!open) {
            loadPayrolls();
          }
        }}
      />
    </div>
  );
}