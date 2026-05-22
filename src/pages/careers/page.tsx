import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { type Job } from '../../lib/api'
import { recruitmentApi, type PublicJob, type CompanyProfile} from "../../lib/recruitment-api";
import { Button } from "../../components/ui/button";
import ApplyJobDialog from "./_components/apply-job-dialog";



export default function CareersPage() {
  const [jobs, setJobs] = useState<PublicJob[]>([]);
  const [company, setCompany] =
    useState<CompanyProfile | null>(null);
    
const { companySlug } = useParams();

  const [loading, setLoading] =
    useState(true);
    const [selectedJob, setSelectedJob] =
  useState<PublicJob | null>(null);

const [applyOpen, setApplyOpen] =
  useState(false);
  const [search, setSearch] =
    useState("");

  const [department, setDepartment] =
    useState("all");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      // LOAD JOBSs
      const jobsResponse =
        await recruitmentApi.getPublicJobs(companySlug!);

      // LOAD COMPANY PROFILE

     
      const companyResponse =
        await recruitmentApi.getCompanyProfile(companySlug!);

      const openJobs = (
        jobsResponse ?? []
      ).filter(
        (x: Job) => x.status === "open"
      );

      setJobs(openJobs);

      setCompany(
        companyResponse
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const departments = useMemo(() => {
    return Array.from(
      new Set(
        jobs.map((x) => x.department)
      )
    );
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        job.description
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        job.department
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesDepartment =
        department === "all" ||
        job.department === department;

      return (
        matchesSearch &&
        matchesDepartment
      );
    });
  }, [jobs, search, department]);

  function formatSalary(
    min?: number,
    max?: number
  ) {
    if (!min && !max)
      return "Competitive";

    return `₦${Number(
      min ?? 0
    ).toLocaleString()} - ₦${Number(
      max ?? 0
    ).toLocaleString()}`;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
              We're Hiring
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Build the future of
              <span className="text-primary">
                {" "}
                HR Technology
              </span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              {company?.description ??
                "Join our growing team and help build modern workforce solutions for Africa."}
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <a
                href="#open-roles"
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-lg hover:opacity-90 transition"
              >
                View Open Roles
              </a>

              <button className="px-6 py-3 rounded-xl border border-border bg-background hover:bg-muted transition font-medium">
                Learn About Us
              </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-6 mt-12 max-w-lg">
              <div>
                <p className="text-3xl font-black">
                  {company?.teamSize ??
                    20}
                  +
                </p>

                <p className="text-sm text-muted-foreground mt-1">
                  Team Members
                </p>
              </div>

              <div>
                <p className="text-3xl font-black">
                  {company?.countries ??
                    5}
                </p>

                <p className="text-sm text-muted-foreground mt-1">
                  Countries
                </p>
              </div>

              <div>
                <p className="text-3xl font-black">
                  {jobs.length}
                </p>

                <p className="text-sm text-muted-foreground mt-1">
                  Open Roles
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="relative">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Hiring Pipeline
                  </p>

                  <h3 className="text-2xl font-bold mt-1">
                    Open Opportunities
                  </h3>
                </div>

                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                  {company?.name?.charAt(
                    0
                  ) ?? "Z"}
                </div>
              </div>

              <div className="space-y-4">
                {jobs
                  .slice(0, 4)
                  .map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between rounded-2xl border border-border bg-background p-4"
                    >
                      <div>
                        <p className="font-semibold">
                          {job.title}
                        </p>

                        <p className="text-sm text-muted-foreground mt-1">
                          {job.department}
                        </p>
                      </div>

                      <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY JOIN */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Why Join{" "}
            {company?.name ?? "Us"}?
          </h2>

          <p className="text-muted-foreground mt-4 text-lg">
            We build modern enterprise
            software while maintaining a
            flexible, ambitious, and
            people-first culture.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            {
              title:
                "Remote Friendly",
              desc: "Flexible work arrangements for productivity and balance.",
            },
            {
              title:
                "Career Growth",
              desc: "Grow with mentorship, leadership opportunities, and training.",
            },
            {
              title:
                "Competitive Pay",
              desc: "Strong compensation packages and performance rewards.",
            },
            {
              title:
                "Innovative Team",
              desc: "Build impactful products shaping the future of work.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-border bg-card p-6 hover:border-primary/40 transition"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-5">
                {item.title.charAt(0)}
              </div>

              <h3 className="font-bold text-lg">
                {item.title}
              </h3>

              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* OPEN POSITIONS */}
      <section
        id="open-roles"
        className="bg-muted/30 border-y border-border"
      >
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight">
                Open Positions
              </h2>

              <p className="text-muted-foreground mt-2">
                Explore opportunities
                to join our growing
                team.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search jobs..."
                className="h-11 w-72 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-primary"
              />

              <select
                value={department}
                onChange={(e) =>
                  setDepartment(
                    e.target.value
                  )
                }
                className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
              >
                <option value="all">
                  All Departments
                </option>

                {departments.map(
                  (dept) => (
                    <option
                      key={dept}
                      value={dept}
                    >
                      {dept}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="py-20 text-center text-muted-foreground">
              Loading jobs...
            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            filteredJobs.length ===
              0 && (
              <div className="py-20 text-center">
                <h3 className="text-2xl font-bold">
                  No open positions
                </h3>

                <p className="text-muted-foreground mt-3">
                  Try adjusting
                  your search.
                </p>
              </div>
            )}

          {/* JOBS */}
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredJobs.map(
              (job) => (
                <div
                  key={job.id}
                  className="rounded-3xl border border-border bg-card p-7 hover:border-primary/40 transition-all hover:-translate-y-1"
                >
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {
                        job.department
                      }
                    </span>

                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-medium">
                      {job.type.replace(
                        "_",
                        " "
                      )}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold tracking-tight">
                    {job.title}
                  </h3>

                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                    <div>
                      📍{" "}
                      {
                        job.location
                      }
                    </div>

                    <div>
                      💰{" "}
                      {formatSalary(
                        job.salaryMin,
                        job.salaryMax
                      )}
                    </div>
                  </div>

                  <p className="mt-5 text-muted-foreground leading-relaxed line-clamp-3">
                    {
                      job.description
                    }
                  </p>

                  {!!job
                    .requirements
                    ?.length && (
                    <div className="flex flex-wrap gap-2 mt-5">
                      {job.requirements
                        .slice(0, 4)
                        .map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full bg-muted text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-8">
                    <Link
                      to={`/careers/${companySlug}/${job.slug}`}
                      className="text-primary font-medium hover:underline"
                    >
                      View Details
                    </Link>

                    <Button
  onClick={() => {
    setSelectedJob(job);
    setApplyOpen(true);
  }}
>
  Apply Now
</Button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CULTURE */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              A culture focused on
              <span className="text-primary">
                {" "}
                innovation & people
              </span>
            </h2>

            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              At{" "}
              {company?.name ??
                "our company"}
              , we believe the best
              products are built by
              empowered teams.
            </p>

            <div className="space-y-4 mt-8">
              {[
                "Flexible work environment",
                "Continuous learning support",
                "Inclusive and collaborative culture",
                "Opportunity to shape a growing product",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>

                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-primary/10 h-56" />
            <div className="rounded-3xl bg-violet-500/10 h-72 mt-10" />
            <div className="rounded-3xl bg-emerald-500/10 h-72 -mt-10" />
            <div className="rounded-3xl bg-orange-500/10 h-56" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-black tracking-tight">
            Ready to build with us?
          </h2>

          <p className="mt-5 text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Join a fast-growing
            company transforming
            workforce management
            across Africa.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a
              href="#open-roles"
              className="px-7 py-3 rounded-xl bg-background text-foreground font-medium hover:opacity-90 transition"
            >
              Browse Open Roles
            </a>

            <button className="px-7 py-3 rounded-xl border border-primary-foreground/20 hover:bg-primary-foreground/10 transition font-medium">
              Contact Recruiting
            </button>
          </div>
        </div>
      </section>
      <ApplyJobDialog
  open={applyOpen}
  onOpenChange={setApplyOpen}
  job={selectedJob}
/>
    </div>
    
  );

}
