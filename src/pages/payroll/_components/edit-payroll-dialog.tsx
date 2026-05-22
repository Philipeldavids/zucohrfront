import { useEffect } from "react";
import { useForm } from "react-hook-form";

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

import { Input } from "../../../components/ui/input";

import { Button } from "../../../components/ui/button";

import { payrollService } from "../../../lib/api";

import type { Payroll } from "../../../lib/api";

import { toast } from "sonner";

type Props = {
  payroll: Payroll | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

type FormValues = {
  basicSalary: number;
  allowances: number;
  //totalDeductions: number;
  annualRent: number;
  status: string;
};

export default function EditPayrollDialog({
  payroll,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const form = useForm<FormValues>({
    defaultValues: {
      basicSalary: 0,
      allowances: 0,
      //totalDeductions: 0,
      annualRent: 0,
      status: "Draft",
    },
  });

  useEffect(() => {
    if (payroll && open) {
      form.reset({
        basicSalary:
          Number(payroll.basicSalary) || 0,

        allowances:
          Number(payroll.allowances) || 0,

        // totalDeductions:
        //   Number(
        //     payroll.totalDeductions
        //   ) || 0,
          annualRent: Number(
            payroll.employee?.annualRent
          ) || 0,
        status:
          payroll.payRun?.status ||
          "Draft",
      });
    }
  }, [payroll, open, form]);

  const loading =
    form.formState.isSubmitting;

  async function handleSubmit(
    values: FormValues
  ) {
    if (!payroll) return;

    try {
      await payrollService.update(
        payroll.id,
        {
          basicSalary:
            values.basicSalary,

          allowances:
            values.allowances,

        //   totalDeductions:
        //     values.totalDeductions,
            annualRent:
                values.annualRent,

          status: values.status,
        }
      );

      toast.success(
        "Payroll updated successfully"
      );

      onSuccess?.();

      onOpenChange(false);
    } catch (err) {
      console.error(err);

      toast.error(
        "Failed to update payroll"
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Edit Payroll
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              handleSubmit
            )}
            className="space-y-4"
          >
            {/* BASIC SALARY */}
            <FormField
              control={form.control}
              name="basicSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Basic Salary
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          Number(
                            e.target.value
                          )
                        )
                      }
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ALLOWANCES */}
            <FormField
              control={form.control}
              name="allowances"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Allowances
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          Number(
                            e.target.value
                          )
                        )
                      }
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DEDUCTIONS
            <FormField
              control={form.control}
              name="totalDeductions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Deductions
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          Number(
                            e.target.value
                          )
                        )
                      }
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            /> */}
             {/* ANNUAL RENT */}
            <FormField
              control={form.control}
              name="annualRent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Annual Rent
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          Number(
                            e.target.value
                          )
                        )
                      }
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* STATUS */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Status
                  </FormLabel>

                  <FormControl>
                    <select
                      {...field}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="Draft">
                        Draft
                      </option>

                      <option value="Processed">
                        Processed
                      </option>

                      <option value="Paid">
                        Paid
                      </option>
                    </select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* FOOTER */}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  onOpenChange(false)
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}