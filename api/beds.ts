import { axiosAuth } from "@/utils/axios";

export async function getBeds() {
  try {
    const response = await axiosAuth.get("/api/beds");
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}

export async function getBed(id: string) {
  try {
    const response = await axiosAuth.get(`/api/beds/${id}`);
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}

export async function createBed(data: {
  wardId: string;
  bedNumber: string;
  bedStatus: BedStatus;
}) {
  try {
    const response = await axiosAuth.post("/api/beds", data);
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}

export async function updateBed(
  id: string,
  data: { wardId?: string; bedNumber?: string; bedStatus?: BedStatus }
) {
  try {
    const response = await axiosAuth.put(`/api/beds/${id}`, data);
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}

export async function deleteBed(id: string) {
  try {
    const response = await axiosAuth.delete(`/api/beds/${id}`);
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}
