import { useState, useEffect } from "react";
import { type Job, type Candidate, recruitmentService } from "../../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import ApplyJobDialog from "./_components/apply-job-dialog.tsx";
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
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  PlusCircle,
  MoreHorizontal,
  Search,
  MapPin,
  DollarSign,
  Eye,
  UserCheck,
  X,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";
import JobPostDialog from "./_components/job-post-dialog.tsx";
import CandidateDetailSheet from "./_components/candidate-detail-sheet.tsx";
import { toast } from "sonner";

const STAGES: { key: Candidate["stage"]; label: string; color: string }[] = [
  { key: "applied", label: "Applied", color: "bg-slate-500" },
  { key: "screening", label: "Screening", color: "bg-amber-500" },
  { key: "interview", label: "Interview", color: "bg-blue-500" },
  { key: "offer", label: "Offer", color: "bg-violet-500" },
  { key: "hired", label: "Hired", color: "bg-emerald-500" },
  { key: "rejected", label: "Rejected", color: "bg-red-500" },
];



const jobStatusBadge: Record<string, string> = {
  open: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  closed: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  draft: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const jobTypeBadge: Record<string, string> = {
  full_time: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  part_time: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  contract: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  internship: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
};

const jobTypeLabel: Record<string, string> = {
  full_time: "Full Time",
  part_time: "Part Time",
  contract: "Contract",
  internship: "Internship",
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function RecruitmentPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
const [candidates, setCandidates] =
  useState<Candidate[]>([]);

const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"jobs" | "pipeline">("jobs");
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [candidateSheetOpen, setCandidateSheetOpen] = useState(false);
  const [applyOpen, setApplyOpen] =
  useState(false);
  const departments = Array.from(new Set(jobs.map((j) => j.department)));


  async function loadRecruitmentData() {
  try {
    setLoading(true);

    const [jobsRes, candidatesRes] =
      await Promise.all([
        recruitmentService.jobs(),
        recruitmentService.candidates(),
      ]);
      
    setJobs(jobsRes?.data || []);
setCandidates(candidatesRes?.data || []);
  } catch (err) {
    console.error(err);
    toast.error(
      "Failed to load recruitment data"
    );
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  loadRecruitmentData();
}, []);
  const filteredJobs = jobs.filter((j) => {
    const q = search.toLowerCase();
    const matchSearch = j.title.toLowerCase().includes(q) || j.department.toLowerCase().includes(q) || j.location.toLowerCase().includes(q);
    const matchDept = departmentFilter === "all" || j.department === departmentFilter;
    const matchStatus = statusFilter === "all" || j.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  const pipelineCandidates = candidates.filter((c) => {
    if (selectedJob) return c.jobPostId === selectedJob.id;
    return true;
  });

  const totalApplicants = jobs.reduce((s, j) => s + (j.applicants ?? 0), 0);
  const openJobs = jobs.filter((j) => j.status === "open").length;
  const hiredCount = candidates.filter((c) => c.stage === "hired").length;
  const inInterviewCount = candidates.filter((c) => c.stage === "interview").length;

//  async function handlePostJob(
//   data: Partial<Job>
// ) {
//   try {
//     if (editingJob) {
//       const updated =
//         await recruitmentService.updateJob(
//           editingJob.id,
//           data
//         );

//       setJobs((prev) =>
//         prev.map((j) =>
//           j.id === editingJob.id
//             ? updated
//             : j
//         )
//       );

//       toast.success("Job updated");
//     } else {
//       const created =
//         await recruitmentService.createJob(
//           data
//         );

//       setJobs((prev) => [
//         created,
//         ...prev,
//       ]);

//       toast.success(
//         "Job posted successfully"
//       );
//     }

//     setEditingJob(null);
//     setJobDialogOpen(false);
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to save job");
//   }
// }

 async function handleMoveStage(
  candidateId: string,
  stage: Candidate["stage"]
) {
  try {
    await recruitmentService.moveCandidateStage(
      candidateId,
      stage
    );

    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId
          ? { ...c, stage }
          : c
      )
    );

    toast.success(
      `Candidate moved to ${stage}`
    );
  } catch (err) {
    console.error(err);
    toast.error(
      "Failed to update candidate"
    );
  }
}

  function handleOpenCandidate(candidate: Candidate) {
    setSelectedCandidate(candidate);
    setCandidateSheetOpen(true);
  }

 async function handleCloseJob(jobId: string) {
  try {
    await recruitmentService.closeJob(jobId);

    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status: "closed" as const,
            }
          : j
      )
    );

    toast.success("Job closed");
  } catch (err) {
    console.error(err);

    toast.error("Failed to close job");
  }
}
if (loading) {
  return (
    <div className="flex items-center justify-center py-20 text-muted-foreground">
      Loading recruitment data...
    </div>
  );
}
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
          <h1 className="text-2xl font-bold tracking-tight">Recruitment</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage job openings and candidate pipeline</p>
        </div>
        <Button onClick={() => { setEditingJob(null); setJobDialogOpen(true); }} className="gap-2 self-start sm:self-auto">
          <PlusCircle className="h-4 w-4" /> Post Job
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
          { label: "Open Positions", value: openJobs, icon: Briefcase, color: "text-emerald-500" },
          { label: "Total Applicants", value: totalApplicants, icon: Users, color: "text-blue-500" },
          { label: "In Interview", value: inInterviewCount, icon: Clock, color: "text-violet-500" },
          { label: "Hired This Cycle", value: hiredCount, icon: CheckCircle2, color: "text-teal-500" },
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

      {/* View Toggle + Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
      >
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          {(["jobs", "pipeline"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer capitalize ${
                view === v
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v === "jobs" ? "Job Listings" : "Pipeline"}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-52">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8 h-9 text-sm"
              placeholder="Search jobs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="h-9 text-sm w-36">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Depts</SelectItem>
              {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          {view === "jobs" && (
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-sm w-28">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </motion.div>

      {/* ── Jobs View ── */}
      {view === "jobs" && (
        <motion.div
          key="jobs"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {filteredJobs.map((job) => {
            const jobCandidates = candidates.filter((c) => c.jobPostId === job.id);
            return (
              <Card key={job.id} className="border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base leading-snug truncate">{job.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-0.5">{job.department}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 cursor-pointer">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer" onClick={() => { setEditingJob(job); setJobDialogOpen(true); }}>
                          Edit Job
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => { setSelectedJob(job); setView("pipeline"); }}>
                          View Pipeline
                        </DropdownMenuItem>
                        {job.status === "open" && (
                          <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={() => handleCloseJob(job.id)}>
                            Close Job
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge className={`text-xs px-2 py-0.5 rounded-full font-medium border-0 ${jobStatusBadge[job.status]}`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </Badge>
                    <Badge className={`text-xs px-2 py-0.5 rounded-full font-medium border-0 ${jobTypeBadge[job.type]}`}>
                      {jobTypeLabel[job.type]}
                    </Badge>
                  </div>

                  <div className="space-y-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    {job.salaryMin && (
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          ${job.salaryMin.toLocaleString()} – ${job.salaryMax?.toLocaleString() ?? "—"}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 shrink-0" />
                      <span>{job.applicants ?? 0} applicants</span>
                    </div>
                  </div>

                  {/* Mini pipeline stages */}
                  <div className="flex gap-1 mt-1">
                    {STAGES.filter((s) => s.key !== "rejected").map((s) => {
                      const count = jobCandidates.filter((c) => c.stage === s.key).length;
                      return (
                        <div key={s.key} className="flex-1 text-center">
                          <div className={`h-1 rounded-full mb-1 ${count > 0 ? s.color : "bg-muted"}`} />
                          <span className="text-[10px] text-muted-foreground">{count}</span>
                        </div>
                      );
                    })}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs gap-1 cursor-pointer"
                    onClick={() => { setSelectedJob(job); setView("pipeline"); }}
                  >
                    View Pipeline <ArrowRight className="h-3 w-3" />
                  </Button>
{job.status === "open" && (
  <Button
    size="sm"
    className="w-full"
    onClick={() => {
      setSelectedJob(job);
      setApplyOpen(true);
    }}
  >
    Apply Internally
  </Button>
)}
                </CardContent>
              </Card>
            );
          })}

          {filteredJobs.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Briefcase className="h-10 w-10 mb-3 opacity-40" />
              <p className="text-sm">No job listings found</p>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Pipeline View ── */}
      {view === "pipeline" && (
        <motion.div
          key="pipeline"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Job filter for pipeline */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-muted-foreground">Showing pipeline for:</span>
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => setSelectedJob(null)}
                className={`px-3 py-1 text-sm rounded-full border cursor-pointer transition-colors ${
                  selectedJob === null ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"
                }`}
              >
                All Jobs
              </button>
              {jobs.filter((j) => j.status === "open").map((j) => (
                <button
                  key={j.id}
                  onClick={() => setSelectedJob(j)}
                  className={`px-3 py-1 text-sm rounded-full border cursor-pointer transition-colors truncate max-w-[160px] ${
                    selectedJob?.id === j.id ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"
                  }`}
                >
                  {j.title}
                </button>
              ))}
            </div>
          </div>

          {/* Kanban columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {STAGES.map((stage) => {
              const stageCandidates = pipelineCandidates.filter((c) => c.stage === stage.key);
              return (
                <div key={stage.key} className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 px-1">
                    <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{stage.label}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{stageCandidates.length}</span>
                  </div>

                  <div className="space-y-2 min-h-[120px]">
                    {stageCandidates.map((candidate) => (
                      <Card
                        key={candidate.id}
                        className="border-border/40 hover:border-primary/30 transition-colors cursor-pointer"
                        onClick={() => handleOpenCandidate(candidate)}
                      >
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-start gap-2">
                            <Avatar className="h-7 w-7 shrink-0">
                              <AvatarFallback className="text-[10px]">{initials(candidate.fullName)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{candidate.fullName}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{candidate.jobPostTitle}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {stage.key !== "hired" && stage.key !== "rejected" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 cursor-pointer"
                                  title="Move to next stage"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const idx = STAGES.findIndex((s) => s.key === stage.key);
                                    if (idx < STAGES.length - 2) {
                                      handleMoveStage(candidate.id, STAGES[idx + 1].key);
                                    }
                                  }}
                                >
                                  <ArrowRight className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-destructive cursor-pointer"
                                  title="Reject"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMoveStage(candidate.id, "rejected");
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                            {stage.key === "offer" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-emerald-500 cursor-pointer"
                                title="Mark hired"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveStage(candidate.id, "hired");
                                }}
                              >
                                <UserCheck className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-auto cursor-pointer"
                              title="View details"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenCandidate(candidate);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {stageCandidates.length === 0 && (
                      <div className="border border-dashed border-border/40 rounded-lg h-14 flex items-center justify-center">
                        <span className="text-[10px] text-muted-foreground">Empty</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

      )}

      {/* Dialogs / Sheets */}
  <ApplyJobDialog
  open={applyOpen}
  onOpenChange={setApplyOpen}
  jobId={selectedJob?.id ?? ""}
  onSuccess={loadRecruitmentData}
/>
    <JobPostDialog
  open={jobDialogOpen}
  onOpenChange={(o) => {
    setJobDialogOpen(o);

    if (!o) {
      setEditingJob(null);
    }
  }}
  initialData={editingJob}
  onSuccess={loadRecruitmentData}
/>
      <CandidateDetailSheet
        open={candidateSheetOpen}
        onOpenChange={setCandidateSheetOpen}
        candidate={selectedCandidate}
        onMoveStage={handleMoveStage}
      />
    </div>
  );
}
//}