import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import type { Job } from "../../../lib/api";
import { recruitmentService } from "../../../lib/api";

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
import { Textarea } from "../../../components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(2, "Title required"),

  department: z.string().min(1, "Department required"),

  location: z.string().min(1, "Location required"),

  type: z.enum([
    "full_time",
    "part_time",
    "contract",
    "internship",
  ]),

  status: z.enum([
    "open",
    "draft",
    "closed",
  ]),

  description: z
    .string()
    .min(10, "Description required"),

  requirements: z.string(),

  salaryMin: z.string().optional(),

  salaryMax: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: Job | null;
  onSuccess?: () => void;
};

export default function JobPostDialog({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const isEdit = !!initialData;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      title: "",
      department: "",
      location: "",
      type: "full_time",
      status: "open",
      description: "",
      requirements: "",
      salaryMin: "",
      salaryMax: "",
    },
  });

  // ======================================
  // RESET FORM
  // ======================================

  useEffect(() => {
    if (initialData && open) {
      form.reset({
        title: initialData.title,
        department: initialData.department,
        location: initialData.location,
        type: initialData.type,
        status: initialData.status,
        description: initialData.description,

        requirements:
          initialData.requirements?.join(
            "\n"
          ) ?? "",

        salaryMin:
          initialData.salaryMin?.toString() ??
          "",

        salaryMax:
          initialData.salaryMax?.toString() ??
          "",
      });
    } else {
      form.reset({
        title: "",
        department: "",
        location: "",
        type: "full_time",
        status: "open",
        description: "",
        requirements: "",
        salaryMin: "",
        salaryMax: "",
      });
    }
  }, [initialData, open, form]);

  // ======================================
  // SUBMIT
  // ======================================

  async function handleSubmit(
    values: FormValues
  ) {
    try {
      setLoading(true);

      const payload: Partial<Job> = {
        title: values.title,

        department: values.department,

        location: values.location,

        type: values.type,

        status: values.status,

        description: values.description,

        requirements: values.requirements
          .split("\n")
          .map((r) => r.trim())
          .filter(Boolean),

        salaryMin: values.salaryMin
          ? Number(values.salaryMin)
          : undefined,

        salaryMax: values.salaryMax
          ? Number(values.salaryMax)
          : undefined,
      };

      if (isEdit && initialData?.id) {
        await recruitmentService.updateJob(
          initialData.id,
          payload
        );

        toast.success(
          "Job updated successfully"
        );
      } else {
        await recruitmentService.createJob(
          payload
        );

        toast.success(
          "Job posted successfully"
        );
      }

      form.reset();

      onOpenChange(false);

      onSuccess?.();
    } catch (err: any) {
      console.error(err);

      toast.error(
        err?.message ??
          "Failed to save job"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!loading) {
          onOpenChange(o);
        }
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? "Edit Job"
              : "Post New Job"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              handleSubmit
            )}
            className="space-y-4"
          >
            {/* TITLE */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Job Title
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Senior Frontend Developer"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DEPARTMENT + LOCATION */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Department
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Engineering"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Location
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Remote"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* TYPE + STATUS */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Employment Type
                    </FormLabel>

                    <Select
                      value={field.value}
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
                        <SelectItem value="full_time">
                          Full Time
                        </SelectItem>

                        <SelectItem value="part_time">
                          Part Time
                        </SelectItem>

                        <SelectItem value="contract">
                          Contract
                        </SelectItem>

                        <SelectItem value="internship">
                          Internship
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Status
                    </FormLabel>

                    <Select
                      value={field.value}
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
                        <SelectItem value="open">
                          Open
                        </SelectItem>

                        <SelectItem value="draft">
                          Draft
                        </SelectItem>

                        <SelectItem value="closed">
                          Closed
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* SALARY */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="salaryMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Minimum Salary
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        placeholder="70000"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salaryMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Maximum Salary
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100000"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      rows={5}
                      placeholder="Describe the role..."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* REQUIREMENTS */}
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Requirements
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder={`5+ years React\nTypeScript\nNode.js`}
                      {...field}
                    />
                  </FormControl>

                  <p className="text-xs text-muted-foreground">
                    Enter one requirement per
                    line
                  </p>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                disabled={loading}
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
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : isEdit ? (
                  "Save Changes"
                ) : (
                  "Post Job"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}