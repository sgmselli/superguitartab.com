import type { TabResponse } from "../types/tab";
import type { UserResponse, UserCreateRequest, UserLoginRequest } from "../types/user";
import { api, apiAuth } from "./index";

export async function registerUser(
  user: UserCreateRequest
): Promise<UserResponse> {
  const response = await api.post("/user/register", {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    password: user.password,
    confirm_password: user.confirmPassword
  });
  return response.data;
}

export async function loginUser(
  user: UserLoginRequest
): Promise<UserResponse> {

    const form = new URLSearchParams();
    form.append("username", user.email);
    form.append("password", user.password);

    const response = await api.post(
        "/auth/login", 
        form,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );
  return response.data;
}

export async function logoutUser(
): Promise<UserResponse> {
  const response = await apiAuth.post("/auth/logout");
  return response.data;
}

export async function getCurrentUser(
): Promise<UserResponse> {
  const response = await apiAuth.get("/user/current");
  return response.data;
}

export async function getCurrentUserDownloadedTabs(
): Promise<TabResponse[]> {
  const response = await apiAuth.get("/user/current/downloads");
  return response.data;
}


