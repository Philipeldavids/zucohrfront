import { useEffect } from "react";
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
import { Receipt, Loader2 } from "lucide-react";
import { expenseService, type Expense } from "../../../lib/api";

const schema = z.object({
  title: z.string().min(3, "Expense title is required"),

  category: z.enum([
    "travel",
    "meals",
    "equipment",
    "training",
    "other",
  ]),

  amount: z.coerce
  .number()
  .min(0.01, "Amount must be greater than 0"),

  currency: z.string().min(1, "Currency is required"),

  date: z.string().min(1, "Date is required"),

  description: z
    .string()
    .min(5, "Please describe the expense"),
    receipt: z.any().optional()
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSuccess?: () => void;
  expense?: Expense | null;
};

export default function ExpenseSubmitDialog({
  open,
  onOpenChange,
  onSuccess,
  expense,
}: Props) {
  const isEdit = !!expense;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: "",
      category: "travel",
      amount: 0,
      currency: "NGN",
      date: "",
      description: "",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  // =========================
  // LOAD EDIT VALUES
  // =========================

  useEffect(() => {
    if (expense && open) {
      reset({
        title: expense.title ?? "",
        category:
          (expense.category as FormValues["category"]) ??
          "travel",
        amount: expense.amount ?? 0,
        currency: expense.currency ?? "NGN",
        date: expense.date
          ? new Date(expense.date)
              .toISOString()
              .split("T")[0]
          : "",
        description: expense.description ?? "",
      });
    } else {
      reset({
        title: "",
        category: "travel",
        amount: 0,
        currency: "NGN",
        date: "",
        description: "",
      });
    }
  }, [expense, open, reset]);

  // =========================
  // SUBMIT
  // =========================

 const onSubmit = async (values: FormValues) => {

  console.log(values);
  try {
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("category", values.category);
    formData.append(
      "amount",
      values.amount.toString()
    );
    formData.append(
      "currency",
      values.currency
    );
    formData.append("date", values.date);
    formData.append(
      "description",
      values.description
    );

    if (values.receipt) {
      formData.append(
        "receipt",
        values.receipt
      );
    }
   formData.forEach((value, key) => {
  console.log(key, value);
});
    if (isEdit && expense?.id) {
      await expenseService.update(
        expense.id,
        formData
      );

      toast.success(
        "Expense updated successfully"
      );
    } else {
      await expenseService.submit(formData);

      toast.success(
        "Expense submitted for approval"
      );
    }

    reset();
    onOpenChange(false);
    onSuccess?.();
  } catch (err: any) {
    console.error(err);

    toast.error(
      err?.response?.data?.message ??
        "Failed to save expense"
    );
  }
};
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!isSubmitting) {
          onOpenChange(value);
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Receipt
              size={17}
              className="text-primary"
            />

            {isEdit
              ? "Edit Expense"
              : "Submit Expense"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* TITLE */}
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Expense Title
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="e.g. Flight to Abuja"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CATEGORY + DATE */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Category
                    </FormLabel>

                    <Select
                      onValueChange={
                        field.onChange
                      }
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="travel">
                          Travel
                        </SelectItem>

                        <SelectItem value="meals">
                          Meals
                        </SelectItem>

                        <SelectItem value="equipment">
                          Equipment
                        </SelectItem>

                        <SelectItem value="training">
                          Training
                        </SelectItem>

                        <SelectItem value="other">
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>

                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* AMOUNT + CURRENCY */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      Amount
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={
                          field.value || ""
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? ""
                              : Number(
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

              <FormField
                control={control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Currency
                    </FormLabel>

                    <Select
                      onValueChange={
                        field.onChange
                      }
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="NGN">
                          NGN
                        </SelectItem>

                        <SelectItem value="USD">
                          USD
                        </SelectItem>

                        <SelectItem value="EUR">
                          EUR
                        </SelectItem>

                        <SelectItem value="GBP">
                          GBP
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* DESCRIPTION */}
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      placeholder="Describe the business purpose..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* FILE PLACEHOLDER */}
           <FormField
  control={control}
  name="receipt"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Receipt</FormLabel>

      <FormControl>
        <Input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) =>
            field.onChange(
              e.target.files?.[0]
            )
          }
        />
      </FormControl>

      <p className="text-[11px] text-muted-foreground mt-1">
        Upload JPG, PNG, or PDF
      </p>

      <FormMessage />
    </FormItem>
  )}
/>

            {/* FOOTER */}
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                disabled={isSubmitting}
                onClick={() =>
                  onOpenChange(false)
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Receipt size={14} />

                    {isEdit
                      ? "Update Expense"
                      : "Submit"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}