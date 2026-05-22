import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import type { OnboardingTask } from "../../../lib/api.ts";

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

import { Input } from "../../../components/ui/input.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { Textarea } from "../../../components/ui/textarea.tsx";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select.tsx";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  employeeId: z.string().min(1, "Select an employee"),

  title: z
    .string()
    .min(2, "Title required"),

  description: z
    .string()
    .min(5, "Description required"),

  category: z.enum([
    "documentation",
    "training",
    "equipment",
    "access",
    "other",
  ]),

  dueDate: z
    .string()
    .min(1, "Due date required"),
});

type FormValues = z.infer<
  typeof schema
>;
type Props = {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  employees: {
    id: string;
    name: string;
  }[];

  editingTask?:
    | OnboardingTask
    | null;

  onSubmit: (
    data: Partial<OnboardingTask>
  ) => void | Promise<void>;
};

export default function AddTaskDialog({
  open,
  onOpenChange,
  employees,
  editingTask,
  onSubmit,
}: Props) {
  const [loading, setLoading] =
    useState(false);


  const form = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      employeeId: "",
      title: "",
      description: "",
      category: "documentation",
      dueDate: "",
    },
  });
useEffect(() => {
  if (editingTask) {
    form.reset({
      employeeId:
        editingTask.employeeId,

      title:
        editingTask.title,

      description:
        editingTask.description,

      category:
        editingTask.category,

      dueDate:
        editingTask.dueDate
          ?.split("T")[0] || "",
    });
  } else {
    form.reset({
      employeeId: "",
      title: "",
      description: "",
      category:
        "documentation",
      dueDate: "",
    });
  }
}, [editingTask, form, open]);
  const handleClose = () => {
    form.reset();

    onOpenChange(false);
  };

  async function handleSubmit(
    values: FormValues
  ) {
    try {
      setLoading(true);

      const employee =
        employees.find(
          (e) =>
            e.id ===
            values.employeeId
        );

      await onSubmit({
        employeeId:
          values.employeeId,

        employeeName:
          employee?.name,

        title: values.title,

        description:
          values.description,

        category:
          values.category,

        dueDate:
          values.dueDate,

        status: "pending",
      });

      toast.success(
        "Onboarding task added"
      );

      form.reset();

      onOpenChange(false);
    } catch (err) {
      console.error(err);

      toast.error(
        "Failed to add task"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!loading) {
          onOpenChange(value);

          if (!value) {
            form.reset();
          }
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
  {editingTask
    ? "Edit Onboarding Task"
    : "Add Onboarding Task"}
</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              handleSubmit
            )}
            className="space-y-5"
          >
            {/* EMPLOYEE */}
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Employee
                  </FormLabel>

                  <Select
                    value={field.value}
                    onValueChange={
                      field.onChange
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {employees.map(
                        (employee) => (
                          <SelectItem
                            key={
                              employee.id
                            }
                            value={
                              employee.id
                            }
                          >
                            {
                              employee.name
                            }
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TITLE */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Task Title
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="e.g. Complete tax forms"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DESCRIPTION */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Describe the onboarding task..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CATEGORY + DATE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({
                  field,
                }) => (
                  <FormItem>
                    <FormLabel>
                      Category
                    </FormLabel>

                    <Select
                      value={
                        field.value
                      }
                      onValueChange={
                        field.onChange
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="documentation">
                          Documentation
                        </SelectItem>

                        <SelectItem value="training">
                          Training
                        </SelectItem>

                        <SelectItem value="equipment">
                          Equipment
                        </SelectItem>

                        <SelectItem value="access">
                          Access
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
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Due Date
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="date"
                        min={
                          new Date()
                            .toISOString()
                            .split(
                              "T"
                            )[0]
                        }
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* FOOTER */}
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={
                  handleClose
                }
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                 editingTask
  ? "Update Task"
  : "Add Task"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}