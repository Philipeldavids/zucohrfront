import type { Expense } from "../../../lib/api.ts";
import { formatMoney } from "../../../lib/currency";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet.tsx";
import { Badge } from "../../../components/ui/badge.tsx";
import { Separator } from "../../../components/ui/separator.tsx";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar.tsx";
import {
  User,
  Tag,
  Calendar,
  DollarSign,
  FileText,
  Clock,
} from "lucide-react";

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

const categoryIcon: Record<string, string> = {
  travel: "✈️",
  meals: "🍽️",
  equipment: "💻",
  training: "📚",
  other: "📎",
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

export default function ExpenseDetailSheet({ expense, onClose }: { expense: Expense | null; onClose: () => void }) {
  if (!expense) return null;

  return (
    <Sheet open={!!expense} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display">Expense Details</SheetTitle>
        </SheetHeader>

        {/* Header card */}
        <div className="mt-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/15 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-xl">
                {categoryIcon[expense.category]}
              </div>
              <div>
                <h3 className="font-bold font-display text-foreground leading-tight">{expense.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${categoryColor[expense.category]} text-[10px] capitalize`}>{expense.category}</Badge>
                  <Badge className={`${statusColor[expense.status]} text-[10px] capitalize`}>{expense.status}</Badge>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-bold font-display text-foreground">{formatMoney(expense.amount)}</p>
              <p className="text-xs text-muted-foreground">{expense.currency}</p>
            </div>
          </div>
        </div>

        {/* Employee */}
        <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <Avatar className="w-9 h-9">
            <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
              {expense.employeeName?.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{expense.employeeName}</p>
            <p className="text-xs text-muted-foreground">Submitted by</p>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Details */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Details</h4>
          <InfoRow icon={Calendar} label="Expense Date" value={new Date(expense.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} />
          <InfoRow icon={Clock} label="Submitted" value={new Date(expense.submittedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
          <InfoRow icon={DollarSign} label="Amount" value={`${expense.currency} ${formatMoney(expense.amount)}`} />
          <InfoRow icon={Tag} label="Category" value={expense.category.charAt(0).toUpperCase() + expense.category.slice(1)} />
        </div>

        <Separator className="my-4" />

        {/* Description */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Business Purpose</h4>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-sm text-foreground leading-relaxed">{expense.description}</p>
          </div>
        </div>

        {/* Receipt placeholder */}
        <Separator className="my-4" />
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Receipt</h4>
          <div className="rounded-lg border border-dashed border-border p-4 flex items-center gap-3 text-muted-foreground">
            <FileText size={20} />
            <div>
              <p className="text-sm font-medium">No receipt attached</p>
              <p className="text-xs">Connect to your file storage API</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
