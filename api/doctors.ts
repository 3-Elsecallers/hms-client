import { axiosAuth } from "@/utils/axios";

export async function getDoctors() {
  try {
    const response = await axiosAuth.get("/api/doctors");
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}

export async function createDoctor(data: {
  userId: string;
  specialization: string;
  licenseNumber: string;
  qualification: string;
  yearsOfExperience: number;
}) {
  try {
    const response = await axiosAuth.post("/api/doctors", data);
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}

export async function updateDoctor(
  id: string,
  data: {
    specialization?: string;
    licenseNumber?: string;
    qualification?: string;
    yearsOfExperience?: number;
  }
) {
  try {
    const response = await axiosAuth.put(`/api/doctors/${id}`, data);
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}

export async function deleteDoctor(id: string) {
  try {
    const response = await axiosAuth.delete(`/api/doctors/${id}`);
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}
