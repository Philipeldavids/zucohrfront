import type { Candidate } from "../../../lib/api";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import { Mail, Phone, FileText, Calendar, ArrowRight, UserCheck, X } from "lucide-react";
import { format } from "date-fns";

const stageBadge: Record<string, string> = {
  applied: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  screening: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  interview: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  offer: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  hired: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const STAGE_ORDER: Candidate["stage"][] = ["applied", "screening", "interview", "offer", "hired"];

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: Candidate | null;
  onMoveStage: (candidateId: string, stage: Candidate["stage"]) => void;
};

export default function CandidateDetailSheet({ open, onOpenChange, candidate, onMoveStage }: Props) {
  if (!candidate) return null;

  const currentStageIdx = STAGE_ORDER.indexOf(candidate.stage);
  const canAdvance = currentStageIdx >= 0 && currentStageIdx < STAGE_ORDER.length - 1;
  const nextStage = canAdvance ? STAGE_ORDER[currentStageIdx + 1] : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>Candidate Profile</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-lg font-semibold">{initials(candidate.fullName)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{candidate.fullName}</h3>
              <p className="text-sm text-muted-foreground">{candidate.jobPostTitle}</p>
              <Badge className={`mt-1 text-xs px-2 py-0.5 rounded-full font-medium border-0 ${stageBadge[candidate.stage]}`}>
                {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Contact</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <a href={`mailto:${candidate.email}`} className="hover:underline text-primary">{candidate.email}</a>
              </div>
              {candidate.phoneNumber && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{candidate.phoneNumber}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>Applied {format(new Date(candidate.appliedAt), "MMM d, yyyy")}</span>
              </div>
            </div>
          </div>

          {candidate.resumeUrl && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Resume</h4>
                <Button variant="ghost" size="sm" className="gap-2 cursor-pointer" asChild>
                  <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4" /> View Resume
                  </a>
                </Button>
              </div>
            </>
          )}

          {candidate.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Notes</h4>
                <p className="text-sm text-muted-foreground">{candidate.notes}</p>
              </div>
            </>
          )}

          {/* Pipeline Progress */}
          <Separator />
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Pipeline Stage</h4>
            <div className="flex gap-1">
              {STAGE_ORDER.map((s, i) => (
                <div
                  key={s}
                  className={`flex-1 h-1.5 rounded-full ${
                    i <= currentStageIdx ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          {candidate.stage !== "hired" && candidate.stage !== "rejected" && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Actions</h4>
                <div className="flex flex-wrap gap-2">
                  {nextStage && (
                    <Button
                      size="sm"
                      className="gap-1 cursor-pointer"
                      onClick={() => { onMoveStage(candidate.id, nextStage); onOpenChange(false); }}
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                      Move to {nextStage.charAt(0).toUpperCase() + nextStage.slice(1)}
                    </Button>
                  )}
                  {candidate.stage === "offer" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="gap-1 cursor-pointer"
                      onClick={() => { onMoveStage(candidate.id, "hired"); onOpenChange(false); }}
                    >
                      <UserCheck className="h-3.5 w-3.5" /> Mark Hired
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1 text-destructive hover:text-destructive cursor-pointer"
                    onClick={() => { onMoveStage(candidate.id, "rejected"); onOpenChange(false); }}
                  >
                    <X className="h-3.5 w-3.5" /> Reject
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
