import type { TabFileUrlResponse, TabResponse } from "../types/tab";
import { api } from "./index";

export async function getTabData(id: string): Promise<TabResponse>{
  const response = await api.get(`tabs/tab/${id}`);
  return response.data;
}

export async function downloadTab(id: string): Promise<TabFileUrlResponse>{
  const response = await api.get(`tabs/tab/${id}/download`);
  return response.data;
}

export async function getTabs(limit: number = 15, offset: number = 0): Promise<TabResponse[]>{
  const response = await api.get(`tabs/?limit=${limit}&offset=${offset}`);
  return response.data;
}

export async function getTabsByGenre(genre: string, limit: number = 15, offset: number = 0): Promise<TabResponse[]>{
  const response = await api.get(`tabs/genre/${genre}?limit=${limit}&offset=${offset}`);
  return response.data;
}

export async function getTabsByStyle(style: string, limit: number = 15, offset: number = 0): Promise<TabResponse[]>{
  const response = await api.get(`tabs/style/${style}?limit=${limit}&offset=${offset}`);
  return response.data;
}

export async function searchTabs(query: string): Promise<TabResponse[]>{
  const response = await api.get(`tabs/search?query=${query}`);
  return response.data;
}

