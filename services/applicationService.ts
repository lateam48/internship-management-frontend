import { apiClient } from "@/lib/axios";

import { ApplicationResponseDTO } from "@/types";

const BASE_URL = "/applications";

const createApplication = async (
  studentId: number,
  offerId: number,
  cvFile: File,
  coverLetterFile: File
) => {
  const formData = new FormData();
  formData.append("cv", cvFile);
  formData.append("coverLetter", coverLetterFile);

  const response = await apiClient.post<ApplicationResponseDTO>(
    `${BASE_URL}?studentId=${studentId}&offerId=${offerId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

const getAllApplications = async () => {
  const response = await apiClient.get<ApplicationResponseDTO[]>(BASE_URL);
  return response.data;
};

const deleteApplication = async (id: number, studentId: number) => {
  await apiClient.delete(`${BASE_URL}/${id}?studentId=${studentId}`);
};

const updateApplication = async (
  id: number,
  studentId: number,
  offerId: number,
  cvFile: File,
  coverLetterFile: File
) => {
  const formData = new FormData();
  formData.append("cv", cvFile);
  formData.append("coverLetter", coverLetterFile);

  const response = await apiClient.put<ApplicationResponseDTO>(
    `${BASE_URL}/${id}?studentId=${studentId}&offerId=${offerId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

const updateStatus = async (id: number, status: string) => {
  const response = await apiClient.patch<ApplicationResponseDTO>(
    `${BASE_URL}/${id}/status?status=${status}`
  );
  return response.data;
};

const getMyApplications = async () => {
  const response = await apiClient.get<ApplicationResponseDTO[]>(
    `${BASE_URL}/my-applications`
  );
  return response.data;
};

const getApplicationsByStudent = async (studentId: number) => {
  const response = await apiClient.get<ApplicationResponseDTO[]>(
    `${BASE_URL}/my-applications`
  );
  return response.data;
};

const getApplicationsByOffer = async (offerId: number) => {
  const response = await apiClient.get<ApplicationResponseDTO[]>(
    `${BASE_URL}/offer/${offerId}`
  );
  return response.data;
};

const getApplicationsByCompany = async (companyId: number) => {
  const response = await apiClient.get<ApplicationResponseDTO[]>(
    `${BASE_URL}/company/${companyId}`
  );
  return response.data;
};

const getApplicationBundle = async (applicationId: number) => {
  try {
    const response = await apiClient.get(
      `${BASE_URL}/${applicationId}/bundle`,
      {
        responseType: "blob",
      }
    );

    if (response.data) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers["content-disposition"];
      let filename = `application_${applicationId}_documents.zip`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      link.setAttribute("download", filename);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      console.error("Download failed: No data received.");
      throw new Error("No data received for download.");
    }
  } catch (error) {
    console.error("Error downloading application bundle:", error);
    throw error;
  }
};



export default {
  createApplication,
  getAllApplications,
  deleteApplication,
  updateApplication,
  updateStatus,
  getMyApplications,
  getApplicationsByStudent,
  getApplicationsByOffer,
  getApplicationsByCompany,
  getApplicationBundle,
};
