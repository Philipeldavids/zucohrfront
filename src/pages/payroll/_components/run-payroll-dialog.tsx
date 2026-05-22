import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";
import { PlayCircle } from "lucide-react";
import { payrollService, type createPayrunDTO } from "../../../lib/api";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const schema = z.object({
  month: z.string().min(1, "Required"),
  year: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof schema>;

type Props = { open: boolean; onOpenChange: (o: boolean) => void };

export default function RunPayrollDialog({ open, onOpenChange }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { month: "February", year: "2024" },
  });

  const onSubmit = (values: FormValues) => {

     const payload = {
      ...values,
    month: values.month,
    year: values.year
    };
    // TODO: wire up to payrollService.run
    payrollService.run(payload)
    console.log("Run payroll:", values);
    toast.success(`Payroll for ${values.month} ${values.year} initiated successfully`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <PlayCircle size={18} className="text-primary" /> Run Payroll
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground -mt-1">
          Select the payroll period to process. This will calculate net pay for all active employees.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-1">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="month" render={({ field }) => (
                <FormItem>
                  <FormLabel>Month</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MONTHS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="year" render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="2028">2028</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-2.5">
              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                This will process payroll for all active employees.
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" className="gap-1.5">
                <PlayCircle size={14} /> Run Payroll
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
