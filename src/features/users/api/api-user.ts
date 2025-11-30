import { api } from "@/lib/axios";

export const createUser = async (payload) => {
  return api.post("/users", payload);
}

export const updateUser = async (id: string, payload) => {
  return api.put(`/users/${id}`, payload);
}

export const getUsers = async (params) => {
  return api.get("/users", { params });
}

export const getUserById = async (id: string) => {
  return api.get(`/users/${id}`);
}

export const getUserProfile = async () => {
  return api.get("/users/profile");
}

