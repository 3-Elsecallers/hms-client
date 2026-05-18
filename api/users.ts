import { axiosAuth } from "@/utils/axios";

export async function getAllUsers() {
  try {
    const response = await axiosAuth.get("/api/users");
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}

export async function getGuestUsers() {
  try {
    const response = await axiosAuth.get("/api/users?role=GUEST");
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}

export async function assignRole(userId: string, role: string) {
  try {
    const response = await axiosAuth.patch(`/api/users/${userId}/role`, {
      role,
    });
    return response;
  } catch (error: any) {
    if (error) return error.response;
  }
}
