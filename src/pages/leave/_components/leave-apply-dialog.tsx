import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { Textarea } from "../../../components/ui/textarea.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { toast } from "sonner";
import { leaveService } from "../../../lib/api.ts";

const schema = z
  .object({
    type: z.enum(["annual", "sick", "maternity", "paternity", "unpaid", "other"]),
    startDate: z.string().min(1, "Required"),
    endDate: z.string().min(1, "Required"),
    reason: z.string().min(5, "Please provide a reason (min 5 characters)"),
  })
 .refine((d) => {
  const start = new Date(d.startDate + "T00:00:00");
  const end = new Date(d.endDate + "T00:00:00");
  return end >= start;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};


export default function LeaveApplyDialog({ open, onOpenChange }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: "annual", startDate: "", endDate: "", reason: "" },
  });

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const days =
    startDate && endDate && new Date(endDate) >= new Date(startDate)
      ? Math.round(
          (new Date(endDate).getTime() - new Date(startDate).getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 1
      : null;

  const onSubmit = async (values: FormValues) => {
    // TODO: wire up to leaveService.apply
    try{
     console.log(values)
      await leaveService.apply(values);
    console.log("Apply leave:", values);
    toast.success("Leave request submitted successfully");
    form.reset();
    onOpenChange(false);
    }
    catch (error) {
       console.error(error);
    toast.error("Failed to submit leave request");
  }
}

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Apply for Leave</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({field }) => (
                <FormItem>
                  <FormLabel>Leave Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="annual">Annual Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="maternity">Maternity Leave</SelectItem>
                      <SelectItem value="paternity">Paternity Leave</SelectItem>
                      <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {days !== null && (
              <p className="text-xs text-primary font-medium bg-primary/5 rounded-lg px-3 py-2">
                Duration: <strong>{days} day{days > 1 ? "s" : ""}</strong>
              </p>
            )}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Briefly describe the reason for your leave..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Request</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
