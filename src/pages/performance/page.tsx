import { useState, useEffect, useMemo } from "react";
import { type Review, type Employee, performanceService, employeeService } from "../../lib/api";
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
} from "../../components/ui/select.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu.tsx";
import {
  TrendingUp,
  Star,
  ClipboardList,
  CheckCircle2,
  PlusCircle,
  MoreHorizontal,
  Eye,
  Pencil,
  ArrowUpRight,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import ReviewDialog from "./_components/review-dialog.tsx";
import ReviewDetailSheet from "./_components/review-detail-sheet.tsx";
import { toast } from "sonner";

const statusColor: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  submitted: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  acknowledged: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={
            i < Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          }
        />
      ))}
      <span className="ml-1 text-xs font-semibold text-foreground">
        {value.toFixed(1)}
      </span>
    </div>
  );
}

export default function PerformancePage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [statusFilter, setStatusFilter] = useState("All");
  const [periodFilter, setPeriodFilter] = useState("All");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editReview, setEditReview] = useState<Review | null>(null);
  const [viewReview, setViewReview] = useState<Review | null>(null);

  const loadReviews = async () => {
    try {
      const res = await performanceService.list({
        page: "1",
        pageSize: "50",
      });

      setReviews(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reviews");
    }
  };

  const loadEmployees = async () => {
    try {
      const res = await employeeService.list({
        page: "1",
        pageSize: "100",
      });

      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadReviews();
    loadEmployees();
  }, []);

  const filtered = reviews.filter((r) => {
    const matchStatus =
      statusFilter === "All" || r.status === statusFilter;

    const matchPeriod =
      periodFilter === "All" || r.reviewPeriod === periodFilter;

    return matchStatus && matchPeriod;
  });

  const periods = Array.from(
    new Set(reviews.map((r) => r.reviewPeriod))
  );

  // ======================
  // SUMMARY
  // ======================

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length
      : 0;

  const summaryCards = [
    {
      label: "Total Reviews",
      value: reviews.length,
      icon: ClipboardList,
      color:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      trend: `${reviews.length} total`,
    },
    {
      label: "Avg Rating",
      value: avgRating.toFixed(1),
      icon: Star,
      color:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      trend: "Overall performance",
    },
    {
      label: "Acknowledged",
      value: reviews.filter(
        (r) => r.status === "acknowledged"
      ).length,
      icon: CheckCircle2,
      color:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      trend: "Completed",
    },
    {
      label: "Draft Reviews",
      value: reviews.filter((r) => r.status === "draft")
        .length,
      icon: TrendingUp,
      color:
        "bg-violet-500/10 text-violet-600 dark:text-violet-400",
      trend: "Pending submission",
    },
  ];

  // ======================
  // CHARTS
  // ======================

  const ratingDistribution = useMemo(() => {
    return [1, 2, 3, 4, 5].map((rating) => ({
      rating: `${rating}★`,
      count: reviews.filter(
        (r) => Math.round(r.score) === rating
      ).length,
    }));
  }, [reviews]);

  const radarData = useMemo(() => {
    return [
      { subject: "Leadership", score: avgRating || 0 },
      { subject: "Technical", score: avgRating - 0.1 || 0 },
      { subject: "Teamwork", score: avgRating + 0.1 || 0 },
      { subject: "Initiative", score: avgRating - 0.2 || 0 },
      { subject: "Communication", score: avgRating || 0 },
      { subject: "Delivery", score: avgRating + 0.2 || 0 },
    ];
  }, [avgRating]);

  // ======================
  // TOP PERFORMERS
  // ======================

  const topPerformers = useMemo(() => {
    const grouped: Record<
      string,
      {
        employee: Employee | undefined;
        total: number;
        count: number;
      }
    > = {};

    reviews.forEach((review) => {
      if (!grouped[review.employeeId]) {
        grouped[review.employeeId] = {
          employee: employees.find(
            (e) => e.id === review.employeeId
          ),
          total: 0,
          count: 0,
        };
      }

      grouped[review.employeeId].total += review.score;
      grouped[review.employeeId].count += 1;
    });

    return Object.values(grouped)
      .map((g) => ({
        employee: g.employee,
        average: g.total / g.count,
      }))
      .sort((a, b) => b.average - a.average)
      .slice(0, 3);
  }, [reviews, employees]);

  // ======================
  // ACTIONS
  // ======================

  const [loadingReview, setLoadingReview] = useState(false);

const handleEdit = async (id: string) => {
  try {
    setLoadingReview(true);

    const review = await performanceService.get(id);

    setEditReview(review);

    setDialogOpen(true);

  } catch (error) {
    console.error(error);

    toast.error("Failed to load review");
  } finally {
    setLoadingReview(false);
  }
};

  const handleAdd = () => {
    setEditReview(null);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await performanceService.delete(id);

      setReviews((prev) =>
        prev.filter((r) => r.id !== id)
      );

      toast.success("Review deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review");
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
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-semibold font-display">
              Competency Scores
            </CardTitle>
          </CardHeader>

          <CardContent className="flex items-center justify-center pt-2">
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 11 }}
                />

                <Radar
                  dataKey="score"
                  stroke="oklch(0.48 0.2 264)"
                  fill="oklch(0.48 0.2 264)"
                  fillOpacity={0.15}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-semibold font-display">
              Rating Distribution
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ratingDistribution}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis dataKey="rating" />
                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="count"
                  fill="oklch(0.7 0.18 55)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* TOP PERFORMERS */}
            <div className="mt-3 pt-3 border-t space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Top Performers
              </p>

              {topPerformers.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2"
                >
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-semibold">
                      {item.employee?.firstName?.[0]}
                      {item.employee?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>

                  <span className="text-xs flex-1">
                    {item.employee?.firstName}{" "}
                    {item.employee?.lastName}
                  </span>

                  <StarRating value={item.average} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TOOLBAR */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
      >
        <div className="flex gap-2 flex-wrap">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="h-9 w-38 text-sm">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="All">
                All Status
              </SelectItem>

              <SelectItem value="draft">
                Draft
              </SelectItem>

              <SelectItem value="submitted">
                Submitted
              </SelectItem>

              <SelectItem value="acknowledged">
                Acknowledged
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={periodFilter}
            onValueChange={setPeriodFilter}
          >
            <SelectTrigger className="h-9 w-36 text-sm">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="All">
                All Periods
              </SelectItem>

              {periods.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          size="sm"
          className="h-9 gap-1.5 ml-auto"
          onClick={handleAdd}
        >
          <PlusCircle size={14} />
          New Review
        </Button>
      </motion.div>

      {/* TABLE */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3">
                  Employee
                </th>

                <th className="text-left px-4 py-3 hidden md:table-cell">
                  Reviewer
                </th>

                <th className="text-left px-4 py-3 hidden sm:table-cell">
                  Period
                </th>

                <th className="text-left px-4 py-3">
                  Rating
                </th>

                <th className="text-left px-4 py-3 hidden lg:table-cell">
                  Feedback
                </th>

                <th className="text-left px-4 py-3">
                  Status
                </th>

                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>

            <tbody>
              {filtered.map((review) => (
                <tr
                  key={review.id}
                  className="border-b border-border hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                          {review.employee?.firstName?.[0]}
                          {review.employee?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <button
                          onClick={() =>
                            setViewReview(review)
                          }
                          className="font-medium hover:text-primary"
                        >
                          {review.employee?.firstName}{" "}
                          {review.employee?.lastName}
                        </button>

                        <p className="text-xs text-muted-foreground">
                          {review.employeeId}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 hidden md:table-cell">
                    {review.reviewerName ??
                      review.reviewerId}
                  </td>

                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge variant="secondary">
                      {review.reviewPeriod}
                    </Badge>
                  </td>

                  <td className="px-4 py-3">
                    <StarRating value={review.score} />
                  </td>

                  <td className="px-4 py-3 hidden lg:table-cell">
                    <p className="truncate max-w-[200px] text-xs">
                      {review.summary}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <Badge
                      className={`${statusColor[review.status]} capitalize`}
                    >
                      {review.status}
                    </Badge>
                  </td>

                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7"
                           disabled={loadingReview}
                        >
                          <MoreHorizontal size={15} />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            setViewReview(review)
                          }
                        >
                          <Eye
                            size={13}
                            className="mr-2"
                          />
                          View Review
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            handleEdit(review.id)
                          }
                        >
                          <Pencil
                            size={13}
                            className="mr-2"
                          />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() =>
                            handleDelete(review.id)
                          }
                        >
                          <Trash2
                            size={13}
                            className="mr-2"
                          />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No reviews match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DIALOGS */}
      <ReviewDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            loadReviews();
          }
        }}
        review={editReview}
      />

      <ReviewDetailSheet
        review={viewReview}
        onClose={() => setViewReview(null)}
      />
    </div>
  );
}