import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  type Review,
  type Employee,
  employeeService,
  performanceService,
} from "../../../lib/api";

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

import { Input } from "../../../components/ui/input";

import { Textarea } from "../../../components/ui/textarea";

import { Button } from "../../../components/ui/button";

import {
  Star,
  Plus,
  Trash2,
  Target,
  BarChart3,
} from "lucide-react";

import { toast } from "sonner";

const competencySchema = z.object({
  label: z.string().min(1, "Required"),
  score: z.coerce.number().min(1).max(5),
});

const goalSchema = z.object({
  title: z.string().min(1, "Required"),
  isCompleted: z.boolean(),
});

const schema = z.object({
  employeeId: z.string().min(1, "Required"),

  reviewPeriod: z.string().min(1, "Required"),

  score: z.coerce.number().min(1).max(5),

  summary: z.string().min(10, "Please provide detailed feedback"),

  status: z.enum(["draft", "submitted", "acknowledged"]),

  competencies: z.array(competencySchema),

  goals: z.array(goalSchema),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  review?: Review | null;
};

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="cursor-pointer"
        >
          <Star
            size={22}
            className={
              n <= (hover || value)
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted-foreground/30"
            }
          />
        </button>
      ))}

      <span className="ml-2 text-sm font-medium text-foreground self-center">
        {value}/5
      </span>
    </div>
  );
}

const periods = [
  "Q1 2024",
  "Q2 2024",
  "Q3 2024",
  "Q4 2024",
  "Annual 2024",
];

export default function ReviewDialog({
  open,
  onOpenChange,
  review,
}: Props) {
  const isEdit = !!review;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    employeeService
      .list({ page: "1", pageSize: "100" })
      .then((res) => setEmployees(res.data))
      .catch(console.error);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,

    defaultValues: {
      employeeId: "",
      reviewPeriod: "Q1 2024",
      score: 3,
      summary: "",
      status: "draft",

      competencies: [
        {
          label: "Leadership",
          score: 3,
        },
      ],

      goals: [
        {
          title: "",
          isCompleted: false,
        },
      ],
    },
  });

  const {
    fields: competencyFields,
    append: addCompetency,
    remove: removeCompetency,
  } = useFieldArray({
    control: form.control,
    name: "competencies",
  });

  const {
    fields: goalFields,
    append: addGoal,
    remove: removeGoal,
  } = useFieldArray({
    control: form.control,
    name: "goals",
  });

  useEffect(() => {
    if (review) {
      form.reset({
        employeeId: review.employeeId,
        reviewPeriod: review.reviewPeriod,
        score: review.score,
        summary: review.summary,
        status: review.status,

        competencies:
          review.competencies?.length > 0
            ? review.competencies
            : [
                {
                  label: "Leadership",
                  score: 3,
                },
              ],

        goals:
          review.goals?.length > 0
            ? review.goals
            : [
                {
                  title: "",
                  isCompleted: false,
                },
              ],
      });
    } else {
      form.reset({
        employeeId: "",
        reviewPeriod: "Q1 2024",
        score: 3,
        summary: "",
        status: "draft",

        competencies: [
          {
            label: "Leadership",
            score: 3,
          },
        ],

        goals: [
          {
            title: "",
            isCompleted: false,
          },
        ],
      });
    }
  }, [review, open, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      setSaving(true);

      if (isEdit && review?.id) {
        await performanceService.update(review.id, values);

        toast.success("Review updated successfully");
      } else {
        await performanceService.create(values);

        toast.success("Review created successfully");
      }

      onOpenChange(false);
    } catch (error) {
      console.error(error);

      toast.error(
        isEdit
          ? "Failed to update review"
          : "Failed to create review"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEdit
              ? "Edit Performance Review"
              : "New Performance Review"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Top section */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {employees.map((e) => (
                          <SelectItem
                            key={e.id}
                            value={e.id}
                          >
                            {e.firstName} {e.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reviewPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review Period</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {periods.map((p) => (
                          <SelectItem
                            key={p}
                            value={p}
                          >
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Rating */}
            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overall Rating</FormLabel>

                  <FormControl>
                    <StarPicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Feedback */}
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback</FormLabel>

                  <FormControl>
                    <Textarea
                      placeholder="Provide detailed performance feedback..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Competencies */}
            <div className="space-y-4 border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3
                    size={18}
                    className="text-primary"
                  />

                  <h3 className="font-semibold">
                    Competencies
                  </h3>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    addCompetency({
                      label: "",
                      score: 3,
                    })
                  }
                >
                  <Plus size={14} className="mr-1" />
                  Add
                </Button>
              </div>

              {competencyFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-3 items-end"
                >
                  <div className="col-span-7">
                    <FormField
                      control={form.control}
                      name={`competencies.${index}.label`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Competency</FormLabel>

                          <FormControl>
                            <Input
                              placeholder="Leadership"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name={`competencies.${index}.score`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Score</FormLabel>

                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={5}
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-2">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() =>
                        removeCompetency(index)
                      }
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Goals */}
            <div className="space-y-4 border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target
                    size={18}
                    className="text-primary"
                  />

                  <h3 className="font-semibold">
                    Goals
                  </h3>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    addGoal({
                      title: "",
                      isCompleted: false,
                    })
                  }
                >
                  <Plus size={14} className="mr-1" />
                  Add
                </Button>
              </div>

              {goalFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-3 items-end"
                >
                  <div className="col-span-9">
                    <FormField
                      control={form.control}
                      name={`goals.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Goal</FormLabel>

                          <FormControl>
                            <Input
                              placeholder="Complete AWS certification"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-3">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeGoal(index)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="draft">
                        Draft
                      </SelectItem>

                      <SelectItem value="submitted">
                        Submitted
                      </SelectItem>

                      <SelectItem value="acknowledged">
                        Acknowledged
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? isEdit
                    ? "Saving..."
                    : "Creating..."
                  : isEdit
                  ? "Save Changes"
                  : "Create Review"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}