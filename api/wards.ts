import { axiosAuth } from "@/utils/axios";

export async function getWards() {
  try {
    const response = await axiosAuth.get("/api/wards");
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}

export async function getWard(id: string) {
  try {
    const response = await axiosAuth.get(`/api/wards/${id}`);
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}

export async function createWard(data: {
  name: string;
  departmentId: string;
  floorNumber: number;
}) {
  try {
    const response = await axiosAuth.post("/api/wards", data);
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}

export async function updateWard(
  id: string,
  data: { name?: string; departmentId?: string; floorNumber?: number }
) {
  try {
    const response = await axiosAuth.put(`/api/wards/${id}`, data);
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}

export async function deleteWard(id: string) {
  try {
    const response = await axiosAuth.delete(`/api/wards/${id}`);
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}
