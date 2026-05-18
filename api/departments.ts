import { axiosAuth } from "@/utils/axios";

export async function getDepartments() {
  try {
    const response = await axiosAuth.get("/api/departments");
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}

export async function getDepartment(id: string) {
  try {
    const response = await axiosAuth.get(`/api/departments/${id}`);
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}

export async function createDepartment(data: {
  name: string;
  description: string;
}) {
  try {
    const response = await axiosAuth.post("/api/departments", data);
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}

export async function updateDepartment(
  id: string,
  data: { name?: string; description?: string }
) {
  try {
    const response = await axiosAuth.put(`/api/departments/${id}`, data);
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}

export async function deleteDepartment(id: string) {
  try {
    const response = await axiosAuth.delete(`/api/departments/${id}`);
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}
