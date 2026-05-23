import { useRef, useState } from "react";
import Papa  from "papaparse";
import { toast } from "sonner";


import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";

import { Upload } from "lucide-react";

import { employeeService } from "../../../lib/api";

interface Props {
  onSuccess?: () => void;
}

export default function BulkUploadDialog({
  onSuccess,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleFileUpload = async (
    file: File
  ) => {
    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: async (results) => {
        try {
          const employees =
            results.data.map((row: any) => ({
              firstName:
                row.firstName,

              lastName:
                row.lastName,

              email: row.email,

              phoneNumber:
                row.phoneNumber,
              employeeNumber:
                row.employeeNumber,  
              department:
                row.department,

              position:
                row.position,

              startDate:
                row.startDate,
              basicSalary:
                row.basicSalary,
              allowance:
              row.allowance,
              annualRent:
              row.annualRent,    
              status:
                row.status ||
                "active",
              location:
              row.location,
              employmentType:
               row.employmentType,
            }));

          await employeeService.bulkCreate(
            employees
          );

          toast.success(
            "Employees uploaded successfully"
          );

          setOpen(false);

          onSuccess?.();
        } catch (err) {
          console.error(err);

          toast.error(
            "Bulk upload failed"
          );
        } finally {
          setLoading(false);
        }
      },

      error: () => {
        toast.error(
          "Invalid CSV file"
        );

        setLoading(false);
      },
    });
  };
const downloadTemplate = () => {
  const headers = [
    "firstName",
    "lastName",
    "email",
    "phoneNumber",
    "employeeNumber",
    "department",
    "position",
    "startDate",
    "basicSalary",
    "allowance",
    "annualRent",
    "status",
    "location",
    "employmentType",
  ];

  const sample = [
    "John",
    "Doe",
    "john@company.com",
    "08012345678",
    "EMP001",
    "Engineering",
    "Software Engineer",
    "2026-05-01",
    "450000",
    "50000",
    "1200000",
    "active",
    "Lagos",
    "fullTime",
  ];

  const csv =
    `${headers.join(",")}\n${sample.join(",")}`;

  const blob = new Blob(
    [csv],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.setAttribute(
    "download",
    "zucohr_employee_template.csv"
  );

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Upload size={16} />
          Bulk Upload
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Upload Employees CSV
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
  <Button
    variant="outline"
    className="flex-1"
    onClick={downloadTemplate}
  >
    Download Template
  </Button>

  <Button
    className="flex-1"
    onClick={() =>
      inputRef.current?.click()
    }
    disabled={loading}
  >
    {loading
      ? "Uploading..."
      : "Choose CSV"}
  </Button>
</div>
        <div className="space-y-4">
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file =
                e.target.files?.[0];

              if (file) {
                handleFileUpload(
                  file
                );
              }
            }}
          />

         

          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">
              CSV Columns:
            </p>

            <code className="text-xs">
              firstName,lastName,email,phoneNumber,employeeNumber
              ,department,position,startDate,basicSalary,allowance,annualRent,status,location,employmentType
            </code>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}