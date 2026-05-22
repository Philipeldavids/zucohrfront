import { request, type PaginatedResponse, type Organization } from "./api";


export interface PublicJob {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: "full_time" | "part_time" | "contract" | "internship";
  description: string;
  requirements: string[];
  responsibilities: string[];
  salaryMin?: number;
  salaryMax?: number;
  status: "open" | "closed";
  createdAt: string;
  organization: Organization;
}

export interface ApplyJobRequest {
  fullName: string;
  email: string;
  phone?: string;
  coverLetter?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resume: File;
}
export type CompanyProfile = {
  name: string;
  tagline?: string;
  description?: string;
  teamSize?: number;
  countries?: number;
};

export const recruitmentApi = {
  // =========================================
  // PUBLIC JOBS
  // =========================================

  getCompanyProfile: (companySlug: string) =>
  request<CompanyProfile>(
    `/company/${ companySlug }/public`
  ),
  getPublicJobs: (
    companySlug: string,
    params?: {
      search?: string;
      department?: string;
      location?: string;
      type?: string;

    }
  ) => {
    const query = new URLSearchParams();

    if (params?.search)
      query.append("search", params.search);

    if (params?.department)
      query.append(
        "department",
        params.department
      );

    if (params?.location)
      query.append(
        "location",
        params.location
      );

    if (params?.type)
      query.append("type", params.type);

    return request<PublicJob[]>(
      `/careers/${companySlug}/jobs${
        query.toString()
          ? `?${query.toString()}`
          : ""
      }`
    );
  },

  // =========================================
  // SINGLE PUBLIC JOB
  // =========================================

  getPublicJobBySlug: (companySlug: string, slug: string) =>
    request<PublicJob>(
      `/careers/${companySlug}/jobs/${slug}`
    ),

  // =========================================
  // APPLY TO JOB
  // =========================================

  applyToJob: async (
    companySlug: string,
    jobId: string,
    data: ApplyJobRequest
  ) => {
    const formData = new FormData();

    formData.append(
      "fullName",
      data.fullName
    );

    formData.append("email", data.email);

    if (data.phone?.trim()) {
      formData.append(
        "phone",
        data.phone
      );
    }

    if (data.coverLetter?.trim()) {
      formData.append(
        "coverLetter",
        data.coverLetter
      );
    }

    if (data.linkedinUrl?.trim()) {
      formData.append(
        "linkedinUrl",
        data.linkedinUrl
      );
    }

    if (data.portfolioUrl?.trim()) {
      formData.append(
        "portfolioUrl",
        data.portfolioUrl
      );
    }

    if (data.resume) {
      formData.append(
        "resume",
        data.resume
      );
    }

    return request(
      `/careers/${companySlug}/jobs/${jobId}/apply`,
      {
        method: "POST",
        body: formData,
      }
    );
  },

  
};