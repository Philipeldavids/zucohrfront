import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { employeeService, type Employee } from "../../../lib/api.ts";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select.tsx";
import { toast } from "sonner";

const schema = z.object({

  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().optional(),
  department: z.string().min(1, "Required"),
  position: z.string().min(1, "Required"),
  employeeNumber: z.string().min(1, "Required"),
  location: z.string().optional(),
  basicSalary: z.coerce.number().positive("Must be greater than 0"),
  allowance: z.coerce.number().nonnegative(),
  annualRent: z.coerce.number().nonnegative(),
  status: z.enum(["active", "inactive", "on_leave"]),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), {
  message: "Invalid date",
})
});

type FormValues = z.input<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee | null;
};

const departments = ["Engineering", "Product", "Design", "Finance", "HR", "Marketing", "Sales"];

export default function EmployeeDialog({ open, onOpenChange, employee }: Props) {
  const isEdit = !!employee;
  const [saving, setSaving] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
       
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      department: "",
      position: "",
      employeeNumber: "",
      location: "",
      basicSalary: 0,
      allowance: 0,
      annualRent: 0,
      status: "active",
      startDate: "",
    },
  });

  useEffect(() => {
    if (employee) {
      form.reset({
        
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phoneNumber: employee.phoneNumber ?? "",
        department: employee.department,
        position: employee.position,
        location: employee.location ?? "",
        basicSalary: employee.basicSalary || 0,
        status: employee.status,
        allowance: employee.allowance || 0,
        annualRent: employee.annualRent || 0,
        startDate: employee.startDate
    ? employee.startDate.split("T")[0]
    : "",
        employeeNumber: employee.employeeNumber
      });
    } else {
      form.reset({
        firstName: "", lastName: "", email: "", phoneNumber: "",
        department: "", position: "", location: "",
        basicSalary: 0, allowance: 0, annualRent: 0, employeeNumber: "", status: "active", startDate: "",
      });
    }
  }, [employee, form, open]);

  

const onSubmit = async (values: FormValues) => {
  try {
    setSaving(true);

    const payload = {
      ...values,
      basicSalary: Number(values.basicSalary),
      allowance: Number(values.allowance),
      annualRent: Number(values.annualRent),
      startDate: new Date(values.startDate).toISOString(),
    };

    if (isEdit && employee?.id) {
      await employeeService.update(employee.id, payload);

      toast.success("Employee updated successfully");
    } else {
      await employeeService.create(payload);

      toast.success("Employee added successfully");
    }

    onOpenChange(false);

  } catch (error: any) {
    //console.error(error);

    toast.error(
      error?.response?.data?.message ||
      "Something went wrong"
    );
  } finally {
    setSaving(false);
  }
};
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEdit ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))} className="space-y-4">
             {/* <FormField control={form.control} name="userid"  /> */}
            <div className="grid grid-cols-2 gap-4">

              <FormField control={form.control} name="firstName" render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl><Input placeholder="John" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="lastName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl><Input placeholder="Smith" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input placeholder="john.smith@zucohr.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl><Input placeholder="+1 555 0100" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="department" render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="position" render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl><Input placeholder="Senior Engineer" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl><Input placeholder="New York" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="startDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="basicSalary" render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Salary (USD)</FormLabel>
                 <FormControl>
<Input
 type="text"
  inputMode="decimal"
  placeholder="0.00"
   value={field.value !== undefined ? String(field.value) : ""}
  onChange={(e) => field.onChange(e.target.value)}
/>
</FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="on_leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="allowance" render={({ field }) => (
                <FormItem>
                  <FormLabel>Allowances (USD)</FormLabel>
                 <FormControl>
  <Input
  type="text"
  inputMode="decimal"
  placeholder="0.00"
   value={field.value !== undefined ? String(field.value) : ""}
  onChange={(e) => field.onChange(e.target.value)}
/>
</FormControl>
                  <FormMessage />
                </FormItem>
              )} />

        <FormField control={form.control} name="employeeNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee Number</FormLabel>
                  <FormControl><Input placeholder="#00001" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="annualRent" render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Rent Paid</FormLabel>
                 <FormControl>
<Input
 type="text"
  inputMode="decimal"
  placeholder="0.00"
   value={field.value !== undefined ? String(field.value) : ""}
  onChange={(e) => field.onChange(e.target.value)}
/>
</FormControl>
                  <FormMessage />
                   </FormItem>
                  )} />
              </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button disabled={saving} type="submit">{isEdit ? "Save Changes" : "Add Employee"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
