import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { recruitmentApi, type PublicJob } from "../../lib/recruitment-api";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import ApplyJobDialog from "./_components/apply-job-dialog";
import { MapPin, Briefcase } from "lucide-react";

export default function JobDetailsPage() {
  const { slug } = useParams();
  const { companySlug } = useParams();

  const [job, setJob] = useState<PublicJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyOpen, setApplyOpen] = useState(false);

  useEffect(() => {
    if (slug && companySlug) {
      loadJob(companySlug, slug);
    }
  }, [companySlug, slug]);

  async function loadJob(companySlug: string, slug: string) {
    try {
      setLoading(true);

      const res = await recruitmentApi.getPublicJobBySlug(companySlug, slug);

      setJob(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  if (!job) {
    return <div className="p-10">Job not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-4">
        <Badge>{job.department}</Badge>

        <h1 className="text-4xl font-bold">
          {job.title}
        </h1>

        <div className="flex gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {job.location}
          </div>

          <div className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            {job.type.replace("_", " ")}
          </div>
        </div>

        <Button onClick={() => setApplyOpen(true)}>
          Apply Now
        </Button>
      </div>

      <Card className="p-6 space-y-6">
        <div>
          <h2 className="font-semibold text-xl mb-3">
            Job Description
          </h2>

          <p className="text-muted-foreground whitespace-pre-line">
            {job.description}
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-xl mb-3">
            Responsibilities
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            {job.requirements.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-xl mb-3">
            Requirements
          </h2>

          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            {job.requirements.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </Card>

      <ApplyJobDialog
        open={applyOpen}
        onOpenChange={setApplyOpen}
        job={job}
      />
    </div>
  );
}
