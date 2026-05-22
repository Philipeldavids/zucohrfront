// Mock data for UI demonstration — replace with real API calls via src/lib/api.ts
import type { Employee, Leave, Payroll, Review, Expense, Job, Candidate, OnboardingTask } from "./api.ts";

export const mockEmployees: Employee[] = [
  { id: "1", firstName: "Sarah", lastName: "Johnson", email: "sarah.j@zucohr.com", department: "Engineering", position: "Senior Engineer", status: "active", startDate: "2021-03-15", salary: 95000, location: "New York" },
  { id: "2", firstName: "Marcus", lastName: "Williams", email: "marcus.w@zucohr.com", department: "Product", position: "Product Manager", status: "active", startDate: "2020-07-01", salary: 110000, location: "San Francisco" },
  { id: "3", firstName: "Amira", lastName: "Hassan", email: "amira.h@zucohr.com", department: "Design", position: "UX Designer", status: "active", startDate: "2022-01-10", salary: 85000, location: "Austin" },
  { id: "4", firstName: "James", lastName: "Okafor", email: "james.o@zucohr.com", department: "Finance", position: "Financial Analyst", status: "on_leave", startDate: "2019-11-20", salary: 78000, location: "Chicago" },
  { id: "5", firstName: "Priya", lastName: "Sharma", email: "priya.s@zucohr.com", department: "HR", position: "HR Manager", status: "active", startDate: "2018-05-12", salary: 92000, location: "New York" },
  { id: "6", firstName: "David", lastName: "Chen", email: "david.c@zucohr.com", department: "Engineering", position: "Backend Developer", status: "active", startDate: "2023-02-28", salary: 88000, location: "Remote" },
  { id: "7", firstName: "Fatima", lastName: "Al-Rashid", email: "fatima.r@zucohr.com", department: "Marketing", position: "Marketing Lead", status: "inactive", startDate: "2020-09-14", salary: 82000, location: "Dubai" },
  { id: "8", firstName: "Carlos", lastName: "Mendez", email: "carlos.m@zucohr.com", department: "Sales", position: "Sales Director", status: "active", startDate: "2017-08-01", salary: 125000, location: "Miami" },
];

export const mockLeaves: Leave[] = [
  { id: "1", employeeId: "1", employeeName: "Sarah Johnson", type: "annual", startDate: "2024-02-10", endDate: "2024-02-14", days: 5, reason: "Family vacation", status: "approved", createdAt: "2024-01-20T10:00:00Z" },
  { id: "2", employeeId: "4", employeeName: "James Okafor", type: "sick", startDate: "2024-01-28", endDate: "2024-02-05", days: 7, reason: "Medical recovery", status: "approved", createdAt: "2024-01-27T08:30:00Z" },
  { id: "3", employeeId: "3", employeeName: "Amira Hassan", type: "annual", startDate: "2024-02-20", endDate: "2024-02-22", days: 3, reason: "Personal time off", status: "pending", createdAt: "2024-01-25T14:00:00Z" },
  { id: "4", employeeId: "6", employeeName: "David Chen", type: "sick", startDate: "2024-02-01", endDate: "2024-02-02", days: 2, reason: "Not feeling well", status: "approved", createdAt: "2024-02-01T07:00:00Z" },
  { id: "5", employeeId: "2", employeeName: "Marcus Williams", type: "paternity", startDate: "2024-03-01", endDate: "2024-03-14", days: 14, reason: "Paternity leave", status: "pending", createdAt: "2024-01-30T11:00:00Z" },
];

export const mockPayroll: Payroll[] = [
  { id: "1", employeeId: "1", employeeName: "Sarah Johnson", month: "January", year: 2024, basicSalary: 7916.67, allowances: 500, deductions: 1250, netPay: 7166.67, status: "paid" },
  { id: "2", employeeId: "2", employeeName: "Marcus Williams", month: "January", year: 2024, basicSalary: 9166.67, allowances: 750, deductions: 1500, netPay: 8416.67, status: "paid" },
  { id: "3", employeeId: "3", employeeName: "Amira Hassan", month: "January", year: 2024, basicSalary: 7083.33, allowances: 300, deductions: 1100, netPay: 6283.33, status: "processed" },
  { id: "4", employeeId: "5", employeeName: "Priya Sharma", month: "January", year: 2024, basicSalary: 7666.67, allowances: 400, deductions: 1200, netPay: 6866.67, status: "paid" },
  { id: "5", employeeId: "8", employeeName: "Carlos Mendez", month: "January", year: 2024, basicSalary: 10416.67, allowances: 1000, deductions: 1800, netPay: 9616.67, status: "paid" },
];

export const mockReviews: Review[] = [
  { id: "1", employeeId: "1", employeeName: "Sarah Johnson", reviewerId: "5", reviewerName: "Priya Sharma", period: "Q4 2023", overallRating: 4.5, goals: [], feedback: "Exceptional performance this quarter.", status: "acknowledged", createdAt: "2024-01-10T09:00:00Z" },
  { id: "2", employeeId: "2", employeeName: "Marcus Williams", reviewerId: "5", reviewerName: "Priya Sharma", period: "Q4 2023", overallRating: 4.2, goals: [], feedback: "Strong leadership in product launches.", status: "submitted", createdAt: "2024-01-12T09:00:00Z" },
  { id: "3", employeeId: "3", employeeName: "Amira Hassan", reviewerId: "5", reviewerName: "Priya Sharma", period: "Q4 2023", overallRating: 3.8, goals: [], feedback: "Good work on design system.", status: "draft", createdAt: "2024-01-15T09:00:00Z" },
];

export const mockExpenses: Expense[] = [
  { id: "1", employeeId: "2", employeeName: "Marcus Williams", title: "Client dinner - NYC", category: "meals", amount: 245.50, currency: "USD", date: "2024-01-18", description: "Business dinner with enterprise clients", status: "approved", submittedAt: "2024-01-19T10:00:00Z" },
  { id: "2", employeeId: "8", employeeName: "Carlos Mendez", title: "Flight to Miami conference", category: "travel", amount: 620.00, currency: "USD", date: "2024-01-22", description: "Sales conference travel", status: "approved", submittedAt: "2024-01-23T11:00:00Z" },
  { id: "3", employeeId: "6", employeeName: "David Chen", title: "AWS certification exam", category: "training", amount: 300.00, currency: "USD", date: "2024-01-25", description: "AWS Solutions Architect certification", status: "pending", submittedAt: "2024-01-26T09:00:00Z" },
  { id: "4", employeeId: "3", employeeName: "Amira Hassan", title: "Design software license", category: "equipment", amount: 599.00, currency: "USD", date: "2024-01-28", description: "Figma annual subscription", status: "pending", submittedAt: "2024-01-28T14:00:00Z" },
];

export const mockJobs: Job[] = [
  { id: "1", title: "Senior Frontend Developer", department: "Engineering", location: "New York / Remote", type: "full_time", status: "open", description: "We're looking for an experienced frontend developer...", requirements: ["5+ years React", "TypeScript", "GraphQL"], salaryMin: 100000, salaryMax: 140000, applicants: 24, postedAt: "2024-01-15T09:00:00Z" },
  { id: "2", title: "Data Analyst", department: "Finance", location: "Chicago", type: "full_time", status: "open", description: "Join our data team...", requirements: ["Python", "SQL", "Tableau"], salaryMin: 70000, salaryMax: 95000, applicants: 18, postedAt: "2024-01-18T09:00:00Z" },
  { id: "3", title: "UX Researcher", department: "Design", location: "Remote", type: "full_time", status: "open", description: "Help us understand our users...", requirements: ["User research methods", "Figma", "Data analysis"], applicants: 11, postedAt: "2024-01-20T09:00:00Z" },
  { id: "4", title: "Marketing Intern", department: "Marketing", location: "Austin", type: "internship", status: "open", description: "6-month internship...", requirements: ["Degree in Marketing", "Social media experience"], salaryMin: 2000, salaryMax: 3000, applicants: 43, postedAt: "2024-01-22T09:00:00Z" },
];

export const mockCandidates: Candidate[] = [
  { id: "1", jobId: "1", jobTitle: "Senior Frontend Developer", name: "Alex Turner", email: "alex.t@email.com", phone: "+1 555 0101", stage: "interview", appliedAt: "2024-01-20T10:00:00Z" },
  { id: "2", jobId: "1", jobTitle: "Senior Frontend Developer", name: "Mei Lin", email: "mei.l@email.com", stage: "screening", appliedAt: "2024-01-21T11:00:00Z" },
  { id: "3", jobId: "2", jobTitle: "Data Analyst", name: "Robert Obi", email: "robert.o@email.com", stage: "offer", appliedAt: "2024-01-19T09:00:00Z" },
  { id: "4", jobId: "3", jobTitle: "UX Researcher", name: "Sofia Reyes", email: "sofia.r@email.com", stage: "applied", appliedAt: "2024-01-25T14:00:00Z" },
  { id: "5", jobId: "1", jobTitle: "Senior Frontend Developer", name: "Jordan Blake", email: "jordan.b@email.com", stage: "hired", appliedAt: "2024-01-10T08:00:00Z" },
];

export const mockOnboarding: OnboardingTask[] = [
  { id: "1", employeeId: "6", employeeName: "David Chen", title: "Complete tax forms (W-4)", description: "Fill and submit W-4 and I-9 forms to HR", category: "documentation", dueDate: "2024-03-05", status: "completed", completedAt: "2024-03-01T10:00:00Z" },
  { id: "2", employeeId: "6", employeeName: "David Chen", title: "IT equipment setup", description: "Collect and configure laptop, monitor, accessories", category: "equipment", dueDate: "2024-03-05", status: "completed", completedAt: "2024-03-02T14:00:00Z" },
  { id: "3", employeeId: "6", employeeName: "David Chen", title: "Security & compliance training", description: "Complete mandatory security awareness course", category: "training", dueDate: "2024-03-10", status: "in_progress" },
  { id: "4", employeeId: "6", employeeName: "David Chen", title: "Set up GitHub & Jira access", description: "Request and verify access to engineering tools", category: "access", dueDate: "2024-03-08", status: "completed", completedAt: "2024-03-03T09:00:00Z" },
  { id: "5", employeeId: "6", employeeName: "David Chen", title: "Meet with team leads", description: "Schedule 1:1 intro meetings with each team lead", category: "other", dueDate: "2024-03-12", status: "pending" },
  { id: "6", employeeId: "6", employeeName: "David Chen", title: "Review company handbook", description: "Read and acknowledge the employee handbook", category: "documentation", dueDate: "2024-03-06", status: "completed", completedAt: "2024-03-05T15:00:00Z" },
];

export const dashboardStats = {
  totalEmployees: 248,
  activeEmployees: 231,
  newHires: 12,
  onLeave: 8,
  openPositions: 6,
  pendingLeaves: 14,
  pendingExpenses: 23,
  payrollDue: "Jan 31, 2024",
  monthlyPayroll: 1284500,
};
