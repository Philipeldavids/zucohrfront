// ZucoHR API Service Layer
// Replace BASE_URL with your actual backend API URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://localhost:44318/api";

export async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem("token");

  // Detect FormData
  const isFormData =
    options?.body instanceof FormData;

  const res = await fetch(
    `${BASE_URL}${path}`,
    {
      ...options,

      headers: {
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),

        // ONLY set JSON content type when NOT FormData
        ...(!isFormData
          ? {
              "Content-Type":
                "application/json",
            }
          : {}),

        ...options?.headers,
      },
    }
  );

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({
        message: "Request failed",
      }));

    throw new Error(
      error.message ?? "Request failed"
    );
  }

  // Handle empty responses (204 No Content)
  if (res.status === 204) {
    return {} as T;
  }

  return res.json() as Promise<T>;
}
//--------NotificationService..................................................

export const notificationService ={
   list: () => request<Notification[]>("/notification"),
   markAsRead: ( id: string) =>
    request(`/notification/${id}`, {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
}
//-------RoleService------------------------------------------------------------

export const roleService ={
  list: (params?: Record<string, string>) =>
    request<PaginatedResponse<Role>>(
      `/users/GetRoles?${new URLSearchParams(params).toString()}`,
    ),
   assign: (userId: string, roleId: string) =>
    request("/users/assign-role", {
      method: "POST",
      body: JSON.stringify({ userId, roleId }),
    }),
    create: (data: {
    name: string;
    //description: string;
    permissionIds: string[];
  }) =>
    request("/users/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  removeRole: (userId: string, roleId: string) =>
    request("/users/remove-role", {
      method: "POST",
      body: JSON.stringify({ userId, roleId }),
    }),

  toggleStatus: (userId: string, isActive: boolean) =>
    request("/users/toggle-status", {
      method: "POST",
      body: JSON.stringify({ userId, isActive }),
    }),
}
//-------Permissions Service----------------------------------------------------

export const permissionService = {
  list: () => request<Permissions[]>("/users/permissions")
};
//-----User Service-------------------------------------------------------------
export const userService = {
  list: (params?: Record<string, string>) =>
    request<PaginatedResponse<User>>(
      `/users?${new URLSearchParams(params).toString()}`,
    ),
   get: (id: string) =>
    request<User>(`/users/${id}`),
}

// ─── Auth Service ────────────────────────────────────────────────────────────
export const authService = {
  login: (email: string, password: string) =>
    request<{ accessToken: string; refreshToken: string; user: User; organization: Organization }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
   register: (email: string, password: string, name : string, organizationName: string) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name, organizationName }),
    }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request<User>("/auth/me"),
};

// ─── Employee Service ─────────────────────────────────────────────────────────
export const employeeService = {
  list: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return request<PaginatedResponse<Employee>>(`/employees/GetAll${query}`);
  },

  get: (id: string) =>
    request<Employee>(`/employees/${id}`),

  create: (data: CreateEmployeeDto) =>
    request<Employee>("/employees", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: CreateEmployeeDto) =>
    request<Employee>(`/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request(`/employees/${id}`, { method: "DELETE" }),
};

// ─── Leave Service ────────────────────────────────────────────────────────────
export const leaveService = {
  list: (params?: Record<string, string>) =>
    request<PaginatedResponse<Leave>>(`/leave?${new URLSearchParams(params).toString()}`),
  get: (id: string) => request<Leave>(`/leave/${id}`),
  apply: (data: CreateLeaveDto) =>
    request<Leave>("/leave", { method: "POST", body: JSON.stringify(data) }),
  approve: (id: string) => request<Leave>(`/leave/${id}/approve`, { method: "POST" }),
  reject: (id: string) =>
    request<Leave>(`/leave/${id}/reject`, {
      method: "POST",
      //body: JSON.stringify({ reason }),
    }),
  cancel: (id: string) => request(`/leaves/${id}/cancel`, { method: "PATCH" }),
  balance: (employeeId: string) =>
    request<LeaveBalance[]>(`/leaves/balance/${employeeId}`),
};

// ─── Payroll Service ──────────────────────────────────────────────────────────
export const payrollService = {
  list: (params?: Record<string, string>) => {
     const query = params ? `?${new URLSearchParams(params)}` : "";
    return request<PaginatedResponse<Payroll>>(`/payroll/payslipall${query}`)
  },
   get: (id: string) => request<Payroll>(`/payroll/${id}`),
   update: (
    id: string,
    data: {
      basicSalary?: number;
      allowances?: number;
      //totalDeductions?: number;
      annualRent?: number;
      status?: string;
    }
  ) =>
    request<Payroll>(
      `/payroll/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    ),

  run: (data: createPayrunDTO) =>
    request<Payrun>("/payroll/run", { method: "POST", body: JSON.stringify(data) }),
  summary: () => request<PayrollSummary>("/payroll/summary"),
  updateStatus: (
  id: string,
  status: string
) =>
  request(`/payroll/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  }),

downloadPayslip: async (
  id: string
) => {
  const response = await fetch(
    `${BASE_URL}/payroll/${id}/payslip`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok)
    throw new Error(
      "Failed to download payslip"
    );

  return response.blob();
}
};

// ─── Performance Service ──────────────────────────────────────────────────────
export const performanceService = {
  list: (params?: Record<string, string>) =>
    request<PaginatedResponse<Review>>(
      `/performance?${new URLSearchParams(params).toString()}`,
    ),
  get: (id: string) => request<Review>(`/performance/${id}`),
  create: (data: Partial<Review>) =>
    request<Review>("/performance", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Review>) =>
    request<Review>(`/performance/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
    delete: (id: string) =>{
      request(`/performance/${id}`, {
         method: "DELETE"
      })
    }
};

// ─── Expense Service ──────────────────────────────────────────────────────────
export const expenseService = {
  list: (params?: Record<string, string>) =>
    request<PaginatedResponse<Expense>>(
      `/expense?${new URLSearchParams(params).toString()}`,
    ),
  get: (id: string) => request<Expense>(`/expense/${id}`),
  submit: (data: FormData) =>
    request<Expense>("/expense", { method: "POST", body: data }),
  approve: (id: string) => request<Expense>(`/expense/${id}/approve`, { method: "PATCH" }),
  reject: (id: string, reason: string) =>
    request<Expense>(`/expense/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({reason}),
    }),
    update: (id: string, data: FormData) =>
    request<Expense>(`/expense/${id}`, {
      method: "PUT",
      body: data,
    }),
    delete:(id: string) => request<Expense>(`/expense/${id}`, {
         method: "DELETE"
      })
};
//------Career Service------------------------------------------------------------

// ─── Recruitment Service ──────────────────────────────────────────────────────
export const recruitmentService = {
  jobs: () =>
    request<PaginatedResponse<Job>>("/recruitment/jobs"),

  getJob: (id: string) =>
    request<Job>(`/recruitment/jobs/${id}`),

  createJob: (data: Partial<Job>) =>
    request<Job>("/recruitment/jobs", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateJob: (
    id: string,
    data: Partial<Job>
  ) =>
    request<Job>(`/recruitment/jobs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  closeJob: (id: string) =>
    request(`/recruitment/jobs/${id}/close`, {
      method: "PATCH",
    }),
apply: (data: FormData) =>
    request("/recruitment/apply", {
      method: "POST",
      body: data,
    }),
  candidates: () =>
    request<PaginatedResponse<Candidate>>(
      "/recruitment/applicants"
    ),

  moveCandidateStage: (
    id: string,
    status: string
  ) =>
    request(
      `/recruitment/applicants/${id}/stage`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    ),

  applyexternal: (data: FormData) =>
    request("/careers/apply", {
      method: "POST",
      body: data,
    }),
};

// ─── Onboarding Service ───────────────────────────────────────────────────────
export const onboardingService = {
  list: (
    params?: Record<
      string,
      string
    >
  ) =>
    request<
      PaginatedResponse<OnboardingTask>
    >(
      `/onboarding?${new URLSearchParams(
        params
      ).toString()}`
    ),

  create: (
    data: Partial<OnboardingTask>
  ) =>
    request<OnboardingTask>(
      "/onboarding",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),

  update: (
    id: string,
    data: Partial<OnboardingTask>
  ) =>
    request<OnboardingTask>(
      `/onboarding/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    ),

  delete: (id: string) =>
    request<void>(
      `/onboarding/${id}`,
      {
        method: "DELETE",
      }
    ),
};

// ─── Types ────────────────────────────────────────────────────────────────────
export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "hr" | "manager" | "employee";
  avatar?: string;
  department?: string;
  isActive: boolean;
  permissions: string[];
};

export type Organization={
  id: string;
  name: string;
  slug: string;
  currencyCode: string;
  currencySymbol: string;
}
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type createPayrunDTO ={
  year: string;
  month: string;
}
export type CreateEmployeeDto = {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  employeeNumber: string;
  basicSalary: number;
  allowance: number;
  status: "active" | "inactive" | "on_leave";
  startDate: string;
  phoneNumber?: string;
  location?: string;
};
export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  department: string;
  position: string;
  status: "active" | "inactive" | "on_leave";
  startDate: string;
  basicSalary: number;
  annualRent: number;
  avatar?: string;
  managerId?: string;
  location?: string;
  allowance?: number;
  employeeNumber: string;
};
export type CreateLeaveDto = {
type: string;
startDate: string;
endDate: string;
reason: string;

};

export type Notification={
  id: string;
  title: string;
  message: string;
  isRead: boolean;
}
export type Role ={
  id: string;
  name: string;
}

export type Permissions={
  id:string;
  code: string;
}
export type Leave = {
  id: string;
  employeeId: string;
  employeeName?: string;
  employee: Employee;
  type: "annual" | "sick" | "maternity" | "paternity" | "unpaid" | "other";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  approvedBy?: string;
  rejectionReason?: string;
  createdAt: string;
};

export type LeaveBalance = {
  type: string;
  total: number;
  used: number;
  remaining: number;
};

export type Payrun = {
  id: string;
  month: string;
  year: string;
  periodStart: string;
  periodEnd: string;
  status: "Draft" | "Processed" | "Paid";
  totaldeductions: Number;
  totalGross: Number;
  totalNet : Number;
}
export type Payroll = {
  id: string;
  employeeId: string;
  employeeName?: string;
  month: string;
  year: string;
  basicSalary: number;
  allowances: number;
  grossPay: number;
  pension: number;
  nhf: number;
  nhis: number;
  rentRelief: number;
  tax: number;
  totalDeductions: number;
  netPay: number;
  payRun: Payrun;
  employee: Employee;
  status: "draft" | "processed" | "paid";
  processedAt?: string;
};

export type PayrollSummary = {
  totalEmployees: number;
  totalPayroll: number;
  totalAllowances: number;
  totalDeductions: number;
  lastRunDate: string;
};

export type Review = {
  id: string;
  employeeId: string;
  employeeName?: string;
  reviewerId: string;
  reviewerName?: string;
  reviewPeriod: string;
  score: number;
  goals: Goal[];
  summary: string;
  status: "draft" | "submitted" | "acknowledged";
  createdAt: string;
  employee: Employee;
  competencies: Competency[];
 
};
export type Competency = {
  id?: string;
  label: string;
  score: number;
};

export type Goal = {
  id?: string;
  title: string;
  isCompleted: boolean;
};
// export type Goal = {
//   id: string;
//   title: string;
//   description: string;
//   rating: number;
//   weight: number;
// };

export type Expense = {
  id: string;
  employeeId: string;
  employeeName?: string;
  title: string;
  category: "travel" | "meals" | "equipment" | "training" | "other";
  amount: number;
  currency: string;
  date: string;
  description: string;
  receiptUrl?: string;
  reason: string,
  status: "Pending" | "Approved" | "Rejected" | "Reimbursed";
  submittedAt: string;
};


export type Job = {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: "full_time" | "part_time" | "contract" | "internship";
  status: "open" | "closed" | "draft";
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  requirements?: string[];
   applicants?: number;
   organization: Organization;
   //responsibilities?: string[];
   //createdAt: string;
  //status: string;
};
export type Candidate = {
  id: string;
  jobPostId: string;
  jobPostTitle?: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  resumeUrl?: string;
  stage: "applied" | "screening" | "interview" | "offer" | "hired" | "rejected";
  appliedAt: string;
  notes?: string;
};

export type OnboardingTask = {
  id: string;
  employeeId: string;
  employeeName?: string;
  title: string;
  description: string;
  category: "documentation" | "training" | "equipment" | "access" | "other";
  dueDate: string;
  completedAt?: string;
  status: "pending" | "in_progress" | "completed";
  assignedTo?: string;
};
