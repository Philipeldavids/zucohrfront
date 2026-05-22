import { useState } from "react";
import { Dialog, DialogContent } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Input } from "../../../components/ui/input";
import { recruitmentService } from "../../../lib/api";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  onSuccess?: () => void;
};

export default function ApplyJobDialog({
  open,
  onOpenChange,
  jobId,
  onSuccess,
}: Props) {
  const [coverLetter, setCoverLetter] =
    useState("");

  const [resume, setResume] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  async function handleApply() {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("jobId", jobId);

      formData.append(
        "coverLetter",
        coverLetter
      );

      if (resume) {
        formData.append("resume", resume);
      }

      await recruitmentService.apply(
        formData
      );

      toast.success(
        "Application submitted"
      );

      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      console.error(err);

      toast.error(
        "Failed to apply"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Apply for Job
          </h2>

          <Textarea
            placeholder="Cover letter"
            value={coverLetter}
            onChange={(e) =>
              setCoverLetter(
                e.target.value
              )
            }
          />

          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) =>
              setResume(
                e.target.files?.[0] ?? null
              )
            }
          />

          <Button
            onClick={handleApply}
            disabled={loading}
            className="w-full"
          >
            {loading
              ? "Submitting..."
              : "Apply"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}