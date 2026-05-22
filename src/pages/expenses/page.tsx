import { useState, useEffect } from "react";
import { formatMoney } from "../../lib/currency";
import RejectExpenseDialog from "./_components/rejectexpense-dialog";
//import { expenseService } from "../../lib/mock-data";
import {type Expense, expenseService } from "../../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
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
  Receipt,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  MoreHorizontal,
  Eye,
  Check,
  X,
  ArrowUpRight,
  DollarSign,
  Banknote,
} from "lucide-react";
import { motion } from "motion/react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import ExpenseSubmitDialog from "./_components/expense-submit-dialog";
import ExpenseDetailSheet from "./_components/expense-detail-sheet";
import { toast } from "sonner";

const statusColor: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Reimbursed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

const categoryColor: Record<string, string> = {
  travel: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  meals: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  equipment: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  training: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  other: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};





export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
const [editExpense, setEditExpense] = useState<Expense | null>(null);
const [rejectOpen, setRejectOpen] = useState(false);

const categoryChartData = (() => {
  const grouped: Record<string, number> = {
    travel: 0,
    meals: 0,
    equipment: 0,
    training: 0,
    other: 0,
  };

  expenses.forEach((expense) => {
    grouped[expense.category] =
      (grouped[expense.category] || 0) +
      expense.amount;
  });

  return [
    {
      name: "Travel",
      value: grouped.travel,
      color: "oklch(0.55 0.15 220)",
    },
    {
      name: "Meals",
      value: grouped.meals,
      color: "oklch(0.65 0.18 55)",
    },
    {
      name: "Equipment",
      value: grouped.equipment,
      color: "oklch(0.55 0.18 290)",
    },
    {
      name: "Training",
      value: grouped.training,
      color: "oklch(0.55 0.14 175)",
    },
    {
      name: "Other",
      value: grouped.other,
      color: "oklch(0.55 0.01 0)",
    },
  ].filter((item) => item.value > 0);
})();

const monthlyData = (() => {
  const grouped: Record<string, number> = {};

  expenses.forEach((expense) => {
    const date = new Date(expense.date);

    const key = `${date.getFullYear()}-${date.getMonth()}`;

    grouped[key] =
      (grouped[key] || 0) + expense.amount;
  });

  return Object.entries(grouped)
    .sort(([a], [b]) => {
      const [aYear, aMonth] = a.split("-").map(Number);
      const [bYear, bMonth] = b.split("-").map(Number);

      return (
        new Date(aYear, aMonth).getTime() -
        new Date(bYear, bMonth).getTime()
      );
    })
    .map(([key, amount]) => {
      const [year, month] = key
        .split("-")
        .map(Number);

      return {
        month: new Date(
          year,
          month
        ).toLocaleString("en-US", {
          month: "short",
        }),

        amount,
      };
    });
})();
const [rejectExpense, setRejectExpense] =
  useState<Expense | null>(null);
const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [submitOpen, setSubmitOpen] = useState(false);
  const [viewExpense, setViewExpense] = useState<Expense | null>(null);

  const handleOpenReject = (expense: Expense) => {
  setRejectExpense(expense);
  setRejectOpen(true);
};
  const loadExpenses = async () => {
  try {
    setLoading(true);

    const res = await expenseService.list({
      page: "1",
      pageSize: "100",
    });

    setExpenses(res.data);
  } catch (err) {
    console.error(err);
    toast.error("Failed to load expenses");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadExpenses();
}, []);

const handleApprove = async (id: string) => {
  try {
    await expenseService.approve(id);

    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: "Approved" as const }
          : e
      )
    );

    toast.success("Expense approved");
  } catch (err) {
    console.error(err);
    toast.error("Failed to approve expense");
  }
};

const handleReject = async (
  id: string,
  reason: string
) => {
  try {
    await expenseService.reject(id, 
      reason,
    );
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status: "Rejected" as const,
              reason: reason,
            }
          : e
      )
    );

    toast.success("Expense rejected");
  } catch (err) {
    console.error(err);
    toast.error("Failed to reject expense");
  }
};
const handleEdit = async (id: string) => {
  try {
    const expense = await expenseService.get(id);

    setEditExpense(expense);
    setSubmitOpen(true);
  } catch (err) {
    console.error(err);
    toast.error("Failed to load expense");
  }
};
const handleDelete = async (id: string) => {
  
  const confirmed = window.confirm(
    "Delete this expense?"
  );

  if (!confirmed) return;

  try {
    await expenseService.delete(id);

    setExpenses((prev) =>
      prev.filter((e) => e.id !== id)
    );

    toast.success("Expense deleted");
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete expense");
  }
};
  const filtered = expenses.filter((e) => {
    const matchStatus = statusFilter === "All" || e.status === statusFilter;
    const matchCat = categoryFilter === "All" || e.category === categoryFilter;
    return matchStatus && matchCat;
  });

  const totalAmount = expenses.reduce((s, e) => s + e.amount, 0);
  const pendingAmount = expenses.filter((e) => e.status === "Pending").reduce((s, e) => s + e.amount, 0);
  const approvedAmount = expenses.filter((e) => e.status === "Approved" || e.status === "Reimbursed").reduce((s, e) => s + e.amount, 0);

  const summaryCards = [
    { label: "Total Submitted", value: formatMoney(totalAmount), sub: `${expenses.length} expenses`, icon: Receipt, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", trend: "+12%" },
    { label: "Pending Approval", value: formatMoney(pendingAmount), sub: `${expenses.filter(e => e.status === "Pending").length} requests`, icon: Clock, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", trend: "2 urgent" },
    { label: "Approved", value:  formatMoney(approvedAmount), sub: `${expenses.filter(e => e.status === "Approved" || e.status === "Reimbursed").length} expenses`, icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", trend: "76% rate" },
    { label: "Rejected", value: `${expenses.filter(e => e.status === "Rejected").length}`, sub: "expenses rejected", icon: XCircle, color: "bg-red-500/10 text-red-600 dark:text-red-400", trend: "0%" },
  ];

  // 
  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.05 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
                    <s.icon size={17} />
                  </div>
                  <span className="flex items-center gap-0.5 text-[11px] font-medium text-emerald-600">
                    <ArrowUpRight size={12} />{s.trend}
                  </span>
                </div>
                <p className="text-2xl font-bold font-display">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                <p className="text-[11px] text-muted-foreground/70 mt-0.5">{s.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly trend */}
        <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <Card className="h-full">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-semibold font-display flex justify-between items-center">
                Monthly Expense Trend
                <Badge variant="secondary" className="text-[10px]">Last 6 months</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 255)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${formatMoney(v / 1000)}k`} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => [
  formatMoney(v),
  "Expenses",
]} />
                  <Bar dataKey="amount" fill="oklch(0.65 0.18 55)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category breakdown */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
          <Card className="h-full">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-semibold font-display">By Category</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3">
              <PieChart width={140} height={140}>
                <Pie data={categoryChartData} cx={65} cy={65} innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={2}>
                  {categoryChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [formatMoney(v), ""]} />
              </PieChart>
              <div className="w-full space-y-1.5">
                {categoryChartData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="font-semibold">{formatMoney(d.value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Toolbar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.3 }} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-36 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Reimbursed">Reimbursed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-9 w-36 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="meals">Meals</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" className="h-9 gap-1.5 ml-auto" onClick={() => setSubmitOpen(true)}>
          <PlusCircle size={14} /> Submit Expense
        </Button>
      </motion.div>

      {/* Expenses table */}
      {loading && (
  <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">
    Loading expenses...
  </div>
)}
{!loading && (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }} className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Employee</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Description</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((exp, i) => (
                <motion.tr
                  key={exp.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                          {exp.employeeName?.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <button onClick={() => setViewExpense(exp)} className="font-medium text-foreground hover:text-primary cursor-pointer transition-colors text-left">
                          {exp.employeeName}
                        </button>
                        <p className="text-xs text-muted-foreground truncate max-w-[140px]">{exp.title}</p>

                         {exp.status === "Rejected" &&
 exp.reason && (
  <p className="text-[11px] text-red-500 mt-1 truncate max-w-[180px]">
    {exp.reason}
  </p>
)}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge className={`${categoryColor[exp.category]} text-[10px] capitalize`}>{exp.category}</Badge>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-muted-foreground truncate max-w-[180px] text-xs">{exp.description}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                    {new Date(exp.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">
                    {formatMoney(exp.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={`${statusColor[exp.status]} text-[10px] capitalize`}>{exp.status}</Badge>
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
      className="cursor-pointer"
      onClick={() => setViewExpense(exp)}
    >
      <Eye size={13} className="mr-2" />
      View Details
    </DropdownMenuItem>

    {exp.status === "Pending" && (
      <>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handleApprove(exp.id)}
        >
          <Check size={13} className="mr-2 text-emerald-600" />
          Approve
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handleEdit(exp.id)}
        >
          <Receipt size={13} className="mr-2" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer text-red-500"
          onClick={() => handleOpenReject(exp)}
        >
          <X size={13} className="mr-2" />
          Reject
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer text-red-500"
          onClick={() => handleDelete(exp.id)}
        >
          <XCircle size={13} className="mr-2" />
          Delete
        </DropdownMenuItem>
      </>
    )}
  </DropdownMenuContent>
</DropdownMenu>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground text-sm">
                    No expenses match your filters.
                  </td>
                </tr>
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr className="border-t border-border bg-muted/30">
                  <td className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase" colSpan={4}>
                    Total ({filtered.length} expenses)
                  </td>
                  <td className="px-4 py-3 text-right font-bold tabular-nums text-foreground">
                    {formatMoney(filtered.reduce((s, e) => s + e.amount, 0))}
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </motion.div>
)}
      <ExpenseSubmitDialog
  open={submitOpen}
  expense={editExpense}
  onSuccess={loadExpenses}

  onOpenChange={(open) => {
    setSubmitOpen(open);

    if (!open) {
      setEditExpense(null);
      loadExpenses();
    }
  }}
  //expense={editExpense}
/>
      <ExpenseDetailSheet expense={viewExpense} onClose={() => setViewExpense(null)} />
    <RejectExpenseDialog
  open={rejectOpen}
  onOpenChange={(open) => {
    setRejectOpen(open);

    if (!open) {
      setRejectExpense(null);
    }
  }}
  expenseId={rejectExpense?.id ?? null}
  onReject={handleReject}
/>
    </div>
  );
}
