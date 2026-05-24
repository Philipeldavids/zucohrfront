import type { Payroll } from "../../../lib/api";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { formatMoney } from "../../../lib/currency";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";

import {
  Building2,
  User,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

// const statusColor: Record<string, string> = {
//   Draft:
//     "bg-gray-100 text-gray-600",
//   Processed:
//     "bg-blue-100 text-blue-700",
//   Paid:
//     "bg-emerald-100 text-emerald-700",
// };

function LineItem({
  label,
  value,
  bold,
  color,
}: {
  label: string;
  value: string;
  bold?: boolean;
  color?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between py-1.5 ${
        bold ? "font-semibold" : ""
      }`}
    >
      <span
        className={`text-sm ${
          bold
            ? "text-black"
            : "text-gray-500"
        }`}
      >
        {label}
      </span>

      <span
        className={`text-sm tabular-nums ${
          color ??
          (bold
            ? "text-black"
            : "text-black")
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function PayslipSheet({
  payroll,
  onClose,
}: {
  payroll: Payroll | null;
  onClose: () => void;
}) {
  if (!payroll) return null;

  const payslipRef =
    useRef<HTMLDivElement>(null);

  const gross =
    Number(
      payroll.basicSalary || 0
    ) +
    Number(
      payroll.allowances || 0
    );

  const downloadPayslip = async () => {
  if (!payslipRef.current) return;

  try {
    // =========================
    // CLONE EXPORT NODE
    // =========================

    const cloned =
      payslipRef.current.cloneNode(
        true
      ) as HTMLElement;

    // =========================
    // REMOVE SVG ICONS
    // =========================

    const icons =
      cloned.querySelectorAll("svg");

    icons.forEach((icon) => {
      icon.remove();
    });

    // =========================
    // FORCE SAFE STYLES
    // =========================

    const elements =
      cloned.querySelectorAll("*");

    elements.forEach((node) => {
      const el =
        node as HTMLElement;

      el.style.color =
        "#111827";

      el.style.background =
        "#ffffff";

      el.style.backgroundColor =
        "#ffffff";

      el.style.borderColor =
        "#d1d5db";

      el.style.boxShadow =
        "none";

      el.style.textShadow =
        "none";

      el.style.filter =
        "none";

      el.style.backdropFilter =
        "none";

      // REMOVE CSS VARIABLES
      el.style.removeProperty(
        "--background"
      );

      el.style.removeProperty(
        "--foreground"
      );

      el.style.removeProperty(
        "--primary"
      );

      el.style.removeProperty(
        "--secondary"
      );

      el.style.removeProperty(
        "--accent"
      );

      el.style.removeProperty(
        "--muted"
      );
    });

    // =========================
    // CREATE TEMP WRAPPER
    // =========================

    const wrapper =
      document.createElement("div");

    wrapper.style.position =
      "fixed";

    wrapper.style.left =
      "-99999px";

    wrapper.style.top = "0";

    wrapper.style.width =
      "800px";

    wrapper.style.background =
      "#ffffff";

    wrapper.appendChild(cloned);

    document.body.appendChild(
      wrapper
    );

    // =========================
    // GENERATE CANVAS
    // =========================

    const canvas =
      await html2canvas(cloned, {
        scale: 2,
        backgroundColor:
          "#ffffff",
        useCORS: true,
      });

    // REMOVE TEMP NODE
    document.body.removeChild(
      wrapper
    );

    // =========================
    // CREATE PDF
    // =========================

    const imgData =
      canvas.toDataURL(
        "image/png"
      );

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth =
      pdf.internal.pageSize.getWidth();

    const pageHeight =
      pdf.internal.pageSize.getHeight();

    const imgWidth =
      pageWidth;

    const imgHeight =
      (canvas.height *
        imgWidth) /
      canvas.width;

    let heightLeft =
      imgHeight;

    let position = 0;

    // FIRST PAGE
    pdf.addImage(
      imgData,
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight
    );

    heightLeft -=
      pageHeight;

    // EXTRA PAGES
    while (heightLeft > 0) {
      position =
        heightLeft -
        imgHeight;

      pdf.addPage();

      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -=
        pageHeight;
    }

    // =========================
    // SAVE FILE
    // =========================

    pdf.save(
      `${payroll.employee?.firstName}_${payroll.employee?.lastName}_${payroll.payRun?.month}_${payroll.payRun?.year}_Payslip.pdf`
    );

    toast.success(
      "Payslip downloaded"
    );
  } catch (err) {
    console.error(err);

    toast.error(
      "Failed to download payslip"
    );
  }
};
  return (
    <Sheet
      open={!!payroll}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <div
  ref={payslipRef}
  id="payslip-export"
  style={{
    background: "#ffffff",
    color: "#111827",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  }}
>
          <SheetHeader>
            <SheetTitle className="font-display text-black">
              Payslip
            </SheetTitle>
          </SheetHeader>

          {/* COMPANY HEADER */}
          <div
            className="mt-4 rounded-xl border p-4"
            style={{
              background:
                "#eef2ff",
              borderColor:
                "#c7d2fe",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center"
                    style={{
                      background:
                        "#4f46e5",
                    }}
                  >
                    <span className="text-white font-bold text-xs font-display">
                      Z
                    </span>
                  </div>

                  <span className="font-bold font-display text-black">
                    ZucoHR Inc.
                  </span>
                </div>

                <p className="text-xs text-gray-500">
                  Payroll Payslip
                </p>
              </div>

              <span
  className="px-2 py-1 rounded-full text-xs font-medium capitalize"
  style={{
    background:
      payroll.payRun?.status === "Paid"
        ? "#dcfce7"
        : payroll.payRun?.status === "Processed"
        ? "#dbeafe"
        : "#f3f4f6",

    color:
      payroll.payRun?.status === "Paid"
        ? "#166534"
        : payroll.payRun?.status === "Processed"
        ? "#1d4ed8"
        : "#4b5563",
  }}
>
  {payroll.payRun?.status}
</span>
            </div>
          </div>

          {/* EMPLOYEE INFO */}
          <div className="mt-4 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Employee Details
            </h4>

            <div className="space-y-2">
              {[
                {
                  icon: User,
                  label: "Name",
                  value:
                    payroll.employee
                      ?.firstName +
                    " " +
                    payroll.employee
                      ?.lastName,
                },
                {
                  icon: Building2,
                  label:
                    "Employee ID",
                  value:
                    payroll.employee
                      ?.employeeNumber ??
                    "N/A",
                },
                {
                  icon: Calendar,
                  label:
                    "Pay Period",
                  value: `${payroll.payRun.month} ${payroll.payRun.year}`,
                },
              ].map(
                ({
                  icon: Icon,
                  label,
                  value,
                }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                      style={{
                        background:
                          "#f3f4f6",
                      }}
                    >
                      <Icon
                        size={12}
                        className="text-gray-500"
                      />
                    </div>

                    <div className="flex-1 flex justify-between">
                      <span className="text-xs text-gray-500">
                        {label}
                      </span>

                      <span className="text-xs font-medium text-black">
                        {value}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div
  style={{
    height: "1px",
    background: "#e5e7eb",
    margin: "16px 0",
  }}
/>

          {/* EARNINGS */}
          <div className="space-y-1">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Earnings
            </h4>

            <LineItem
              label="Basic Salary"
              value={formatMoney(
                payroll.basicSalary
              )}
            />

            <LineItem
              label="Allowances"
              value={formatMoney(
                payroll.allowances
              )}
            />

            <div
  style={{
    height: "1px",
    background: "#e5e7eb",
    margin: "16px 0",
  }}
/>

            <LineItem
              label="Gross Pay"
              value={formatMoney(
                gross
              )}
              bold
            />
          </div>

         <div
  style={{
    height: "1px",
    background: "#e5e7eb",
    margin: "16px 0",
  }}
/>

          {/* DEDUCTIONS */}
          <div className="space-y-1">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Deductions
            </h4>

            <LineItem
              label="Pension"
              value={`-${formatMoney(
                payroll.pension
              )}`}
              color="text-rose-500"
            />

            <LineItem
              label="Housing"
              value={`-${formatMoney(
                payroll.nhf
              )}`}
              color="text-rose-500"
            />

            <LineItem
              label="Health Insurance"
              value={`-${formatMoney(
                payroll.nhis
              )}`}
              color="text-rose-500"
            />

            <LineItem
              label="Rent Relief"
              value={`-${formatMoney(
                payroll.rentRelief
              )}`}
              color="text-rose-500"
            />

            <div
  style={{
    height: "1px",
    background: "#e5e7eb",
    margin: "16px 0",
  }}
/>

            <LineItem
              label="Total Deductions"
              value={`-${formatMoney(
                payroll.totalDeductions
              )}`}
              bold
              color="text-rose-500"
            />
          </div>

          <div
  style={{
    height: "1px",
    background: "#e5e7eb",
    margin: "16px 0",
  }}
/>

          {/* NET PAY */}
          <div
            className="rounded-xl border p-4 flex items-center justify-between"
            style={{
              background:
                "#eef2ff",
              borderColor:
                "#c7d2fe",
            }}
          >
            <div>
              <p className="text-xs text-gray-500">
                Net Pay
              </p>

              <p
                className="text-2xl font-bold font-display"
                style={{
                  color:
                    "#4f46e5",
                }}
              >
                {formatMoney(
                  payroll.netPay
                )}
              </p>
            </div>

            <button
  onClick={downloadPayslip}
  disabled={
    payroll.payRun?.status ===
    "Draft"
  }
  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium disabled:opacity-50"
  style={{
    background: "#e5e7eb",
    color: "#111827",
    border: "1px solid #d1d5db",
  }}
>
  <span>↓</span>
  Download
</button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}