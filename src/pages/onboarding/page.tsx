import { useState, useEffect } from "react";
import {  onboardingService, employeeService,type OnboardingTask, type Employee,
} from "../../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Progress } from "../../components/ui/progress";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
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
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  PlusCircle,
  MoreHorizontal,
  Search,
  CheckCheck,
  FileText,
  Laptop,
  BookOpen,
  KeyRound,
  MoreHorizontal as OtherIcon,
  CalendarDays,
} from "lucide-react";
import { motion } from "motion/react";
import { format, isPast, parseISO } from "date-fns";
import AddTaskDialog from "./_components/add-task-dialog";
import { toast } from "sonner";

const statusBadge: Record<string, string> = {
  pending: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  in_progress: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const categoryIcon: Record<string, React.ReactNode> = {
  documentation: <FileText className="h-3.5 w-3.5" />,
  training: <BookOpen className="h-3.5 w-3.5" />,
  equipment: <Laptop className="h-3.5 w-3.5" />,
  access: <KeyRound className="h-3.5 w-3.5" />,
  other: <OtherIcon className="h-3.5 w-3.5" />,
};

const categoryColor: Record<string, string> = {
  documentation: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  training: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  equipment: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  access: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  other: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function OnboardingPage() {
 const [tasks, setTasks] =
  useState<OnboardingTask[]>([]);

const [employees, setEmployees] =
  useState<Employee[]>([]);

const [loading, setLoading] =
  useState(false);

const [search, setSearch] =
  useState("");

const [categoryFilter, setCategoryFilter] =
  useState("all");

const [statusFilter, setStatusFilter] =
  useState("all");

const [employeeFilter, setEmployeeFilter] =
  useState("all");

const [addDialogOpen, setAddDialogOpen] =
  useState(false);

const [editingTask, setEditingTask] =
  useState<OnboardingTask | null>(null);

  const loadTasks = async () => {
  try {
    setLoading(true);

    const res =
      await onboardingService.list({
        page: "1",
        pageSize: "200",
      });

    setTasks(res.data || []);
  } catch (err) {
    console.error(err);

    toast.error(
      "Failed to load onboarding tasks"
    );
  } finally {
    setLoading(false);
  }
};

const loadEmployees = async () => {
  try {
    const res =
      await employeeService.list({
        page: "1",
        pageSize: "200",
      });

    setEmployees(res.data || []);
  } catch (err) {
    console.error(err);

    toast.error(
      "Failed to load employees"
    );
  }
};

useEffect(() => {
  loadTasks();
  loadEmployees();
}, []);
  // Unique employees from onboarding tasks
  const employeeIds = Array.from(new Set(tasks.map((t) => t.employeeId)));
  const employeeNames = employeeIds.map((id) => {
    const t = tasks.find((task) => task.employeeId === id);
    return { id, name: t?.employeeName ?? id };
  });

  const filteredTasks = tasks.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      (t.employeeName ?? "").toLowerCase().includes(q);
    const matchCat = categoryFilter === "all" || t.category === categoryFilter;
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchEmp = employeeFilter === "all" || t.employeeId === employeeFilter;
    return matchSearch && matchCat && matchStatus && matchEmp;
  });

  // Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const overdueTasks = tasks.filter(
    (t) => t.status !== "completed" && isPast(parseISO(t.dueDate))
  ).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Group by employee
  const groupedByEmployee: Record<string, OnboardingTask[]> = {};
  filteredTasks.forEach((t) => {
    if (!groupedByEmployee[t.employeeId]) groupedByEmployee[t.employeeId] = [];
    groupedByEmployee[t.employeeId].push(t);
  });

  const handleComplete = async (
  taskId: string
) => {
  try {
    await onboardingService.update(
      taskId,
      {
        status: "completed",
        completedAt:
          new Date().toISOString(),
      }
    );

    toast.success(
      "Task marked as complete"
    );

    loadTasks();
  } catch (err) {
    console.error(err);

    toast.error(
      "Failed to complete task"
    );
  }
};

const handleDeleteTask = async (
  taskId: string
) => {
  try {
    await onboardingService.delete(
      taskId
    );

    toast.success(
      "Task deleted"
    );

    loadTasks();
  } catch (err) {
    console.error(err);

    toast.error(
      "Failed to delete task"
    );
  }
};

const handleStartTask = async (
  taskId: string
) => {
  try {
    await onboardingService.update(
      taskId,
      {
        status: "in_progress",
      }
    );

    toast.success("Task started");

    loadTasks();
  } catch (err) {
    console.error(err);

    toast.error(
      "Failed to update task"
    );
  }
};

  const handleAddTask = async (
  data: Partial<OnboardingTask>
) => {
  try {
    await onboardingService.create({
      employeeId: data.employeeId,
      title: data.title,
      description: data.description,
      category: data.category,
      dueDate: data.dueDate,
    });

    toast.success(
      "Task added successfully"
    );

    setAddDialogOpen(false);

    loadTasks();
  } catch (err) {
    console.error(err);

    toast.error(
      "Failed to add task"
    );
  }
};

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Onboarding</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Track new hire onboarding tasks and progress</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} className="gap-2 self-start sm:self-auto">
          <PlusCircle className="h-4 w-4" /> Add Task
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: "Total Tasks", value: totalTasks, icon: CheckCheck, color: "text-blue-500" },
          { label: "Completed", value: completedTasks, icon: CheckCircle2, color: "text-emerald-500" },
          { label: "In Progress", value: inProgressTasks, icon: Clock, color: "text-amber-500" },
          { label: "Overdue", value: overdueTasks, icon: AlertCircle, color: "text-red-500" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-muted/60 ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Overall Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-sm font-semibold text-primary">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1.5">
              {completedTasks} of {totalTasks} tasks completed across {employeeIds.length} new hire{employeeIds.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.12 }}
        className="flex flex-wrap gap-2"
      >
        <div className="relative flex-1 min-w-[180px] sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8 h-9 text-sm"
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
          <SelectTrigger className="h-9 text-sm w-40">
            <SelectValue placeholder="Employee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Employees</SelectItem>
            {employeeNames.map((e) => (
              <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-9 text-sm w-36">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="documentation">Documentation</SelectItem>
            <SelectItem value="training">Training</SelectItem>
            <SelectItem value="equipment">Equipment</SelectItem>
            <SelectItem value="access">Access</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 text-sm w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Tasks grouped by employee */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="space-y-6"
      >
        {Object.entries(groupedByEmployee).map(([empId, empTasks]) => {
          const empName = empTasks[0]?.employeeName ?? empId;
          const empCompleted = empTasks.filter((t) => t.status === "completed").length;
          const empProgress = empTasks.length > 0 ? Math.round((empCompleted / empTasks.length) * 100) : 0;

          return (
            <div key={empId}>
              {/* Employee header */}
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{initials(empName)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold">{empName}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{empCompleted}/{empTasks.length} done</span>
                  </div>
                  <Progress value={empProgress} className="h-1 mt-1" />
                </div>
              </div>

              {/* Task list */}
              <div className="space-y-2 pl-11">
                {empTasks.map((task) => {
                  const isOverdue = task.status !== "completed" && isPast(parseISO(task.dueDate));
                  return (
                    <Card
                      key={task.id}
                      className={`border-border/40 transition-colors ${task.status === "completed" ? "opacity-60" : ""}`}
                    >
                      <CardContent className="p-3 flex items-start gap-3">
                        {/* Status icon */}
                        <div className="mt-0.5 shrink-0">
                          {task.status === "completed" ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : task.status === "in_progress" ? (
                            <Clock className="h-4 w-4 text-amber-500" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/40" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-start gap-2 justify-between">
                            <p className={`text-sm font-medium leading-snug ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                              {task.title}
                            </p>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Badge className={`text-[10px] px-1.5 py-0 rounded-full font-medium border-0 flex items-center gap-1 ${categoryColor[task.category]}`}>
                                {categoryIcon[task.category]}
                                {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                              </Badge>
                              <Badge className={`text-[10px] px-1.5 py-0 rounded-full font-medium border-0 ${statusBadge[task.status]}`}>
                                {task.status === "in_progress" ? "In Progress" : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{task.description}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className={`flex items-center gap-1 text-[11px] ${isOverdue ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
                              <CalendarDays className="h-3 w-3" />
                              Due {format(parseISO(task.dueDate), "MMM d, yyyy")}
                              {isOverdue && " · Overdue"}
                            </span>
                            {task.completedAt && (
                              <span className="text-[11px] text-emerald-600">
                                Completed {format(new Date(task.completedAt), "MMM d")}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        {task.status !== "completed" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 cursor-pointer">
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">

  <DropdownMenuItem
    className="cursor-pointer"
    onClick={() => {
      setEditingTask(task);
    }}
  >
    Edit Task
  </DropdownMenuItem>

  <DropdownMenuItem
    className="cursor-pointer text-red-500"
    onClick={() =>
      handleDeleteTask(task.id)
    }
  >
    Delete Task
  </DropdownMenuItem>

  {task.status === "pending" && (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={() =>
        handleStartTask(task.id)
      }
    >
      Start Task
    </DropdownMenuItem>
  )}

  <DropdownMenuItem
    className="cursor-pointer"
    onClick={() =>
      handleComplete(task.id)
    }
  >
    Mark Complete
  </DropdownMenuItem>

</DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
{loading ? (
  <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
    Loading onboarding tasks...
  </div>
):
        Object.keys(groupedByEmployee).length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Users className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm">No onboarding tasks found</p>
          </div>
        )}
      </motion.div>

      <AddTaskDialog
  open={addDialogOpen || !!editingTask}
  onOpenChange={(open) => {
    if (!open) {
      setAddDialogOpen(false);
      setEditingTask(null);
    }
  }}
  editingTask={editingTask}
  employees={employees.map((e) => ({
    id: e.id,
    name: `${e.firstName} ${e.lastName}`,
  }))}
  onSubmit={async (data) => {
    try {
      // EDIT MODE
      if (editingTask) {
        await onboardingService.update(
          editingTask.id,
          data
        );

        toast.success(
          "Task updated successfully"
        );

        setEditingTask(null);
      }

      // CREATE MODE
      else {
        await onboardingService.create({
          employeeId: data.employeeId,
          title: data.title,
          description: data.description,
          category: data.category,
          dueDate: data.dueDate,
        });

        toast.success(
          "Task added successfully"
        );

        setAddDialogOpen(false);
      }

      loadTasks();
    } catch (err) {
      console.error(err);

      toast.error(
        editingTask
          ? "Failed to update task"
          : "Failed to add task"
      );
    }
  }}
/>
    </div>
  );
}
