import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RejectExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenseId: string | null;
  onReject: (id: string, reason: string) => Promise<void>;
}

export default function RejectExpenseDialog({
  open,
  onOpenChange,
  expenseId,
  onReject,
}: RejectExpenseDialogProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    if (!expenseId) return;

    if (!reason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }

    try {
      setLoading(true);

      await onReject(expenseId, reason);

      toast.success("Expense rejected");

      setReason("");
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject expense");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      setReason("");
    }

    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reject Expense</DialogTitle>

          <DialogDescription>
            Provide a reason for rejecting this expense request.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="reason">
            Rejection Reason
          </Label>

          <Textarea
            id="reason"
            placeholder="Explain why this expense is being rejected..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={loading}
          >
            {loading && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}

            Reject Expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}