import { axiosAuth } from "@/utils/axios";

export async function getNurses() {
  try {
    const response = await axiosAuth.get("/api/nurses");
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}

export async function createNurse(data: {
  userId: string;
  licenseNumber: string;
  ward: string;
  shift: ShiftType;
}) {
  try {
    const response = await axiosAuth.post("/api/nurses", data);
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}

export async function updateNurse(
  id: string,
  data: {
    licenseNumber?: string;
    ward?: string;
    shift?: ShiftType;
  }
) {
  try {
    const response = await axiosAuth.put(`/api/nurses/${id}`, data);
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}

export async function deleteNurse(id: string) {
  try {
    const response = await axiosAuth.delete(`/api/nurses/${id}`);
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}
