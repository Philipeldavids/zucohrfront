import { useEffect, useState } from "react";
import {type Review, type Competency, type Goal } from "../../../lib/api";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { Star, User, CalendarDays, UserCheck, Target } from "lucide-react";
import { Progress } from "../../../components/ui/progress";
import { performanceService } from "../../../lib/api";

const statusColor: Record<string, string> = {
  draft:
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  submitted:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  acknowledged:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

function StarRating({
  value,
  max = 5,
}: {
  value: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          }
        />
      ))}
      <span className="ml-1.5 text-sm font-bold text-foreground">
        {value.toFixed(1)} / 5.0
      </span>
    </div>
  );
}



export default function ReviewDetailSheet({
  review,
  onClose,
}: {
  review: Review | null;
  onClose: () => void;
}) {
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!review) return;

    loadReviewDetails();
  }, [review]);

  const loadReviewDetails = async () => {
    try {
      setLoading(true);

      // Example endpoint:
      // GET /performance/{id}
      const res = await performanceService.get(review!.id);
      console.log(res);
      // Backend should return these fields
      setCompetencies(
        res.competencies ?? [
          { label: "Leadership", score: 4.1 },
          { label: "Technical Skills", score: 4.4 },
          { label: "Teamwork", score: 4.3 },
          { label: "Initiative", score: 3.9 },
          { label: "Communication", score: 4.2 },
          { label: "Delivery", score: 4.5 },
        ]
      );

      setGoals(
         res.goals ?? [
    {
      title: "Improve cross-team collaboration",
      isCompleted: false,
    },
    {
      title: "Complete cloud certification",
      isCompleted: false,
    },
  ]
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!review) return null;

  return (
    <Sheet
      open={!!review}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display">
            Performance Review
          </SheetTitle>
        </SheetHeader>

        {/* Header */}
        <div className="mt-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/15 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="text-base font-bold bg-amber-500/20 text-amber-700 dark:text-amber-400">
                {review.employee?.firstName?.[0]}
                {review.employee?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="font-bold font-display text-foreground">
                {review.employee?.firstName}{" "}
                {review.employee?.lastName}
              </h3>

              <div className="mt-1">
                <StarRating value={review.score} />
              </div>
            </div>

            <Badge
              className={`${statusColor[review.status]} capitalize text-xs`}
            >
              {review.status}
            </Badge>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-4 space-y-2.5">
          {[
            {
              icon: CalendarDays,
              label: "Review Period",
              value: review.reviewPeriod,
            },
            {
              icon: UserCheck,
              label: "Reviewer",
              value: review.reviewerName ?? review.reviewerId ?? "—",
            },
            {
              icon: User,
              label: "Employee ID",
              value: review.employeeId,
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3"
            >
              <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center shrink-0">
                <Icon
                  size={13}
                  className="text-muted-foreground"
                />
              </div>

              <div className="flex-1 flex justify-between">
                <span className="text-xs text-muted-foreground">
                  {label}
                </span>

                <span className="text-xs font-medium text-right">
                  {value}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Competencies */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Competency Breakdown
          </h4>

          {loading ? (
            <p className="text-sm text-muted-foreground">
              Loading competencies...
            </p>
          ) : (
            competencies.map((c) => (
              <div key={c.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">
                    {c.label}
                  </span>

                  <span className="font-semibold text-foreground">
                    {c.score.toFixed(1)}
                  </span>
                </div>

                <Progress
                  value={(c.score / 5) * 100}
                  className="h-1.5"
                />
              </div>
            ))
          )}
        </div>

        <Separator className="my-4" />

        {/* Feedback */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Manager Feedback
          </h4>

          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-sm text-foreground leading-relaxed">
              {review.summary}
            </p>
          </div>
        </div>

        {/* Goals */}
        <Separator className="my-4" />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target size={14} className="text-primary" />

            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Next Period Goals
            </h4>
          </div>

          {goals.length > 0 ? (
            goals.map((goal, index) => (
  <div
    key={goal.id ?? index}
    className="flex items-start gap-2 text-sm"
  >
    <div
      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
        goal.isCompleted ? "bg-emerald-500" : "bg-primary"
      }`}
    />

    <span
      className={
        goal.isCompleted
          ? "line-through text-muted-foreground"
          : "text-foreground"
      }
    >
      {goal.title}
    </span>
  </div>
))
 ) : (
            <p className="text-sm text-muted-foreground">
              No goals assigned.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}