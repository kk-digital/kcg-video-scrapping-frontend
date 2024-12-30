import { QueryCreateSchema } from "@/types";
import { api } from "@/utils/api";

export const getQueries = async (
  offset: number,
  limit: number,
  query: string = "",
  status: string | undefined = undefined
) => {
  let url = "";
  const base_url = "/api/v1/search-queries/list-search-queries";
  if (status) {
    url = `${base_url}?offset=${offset}&limit=${limit}&status=${status}`;
  } else {
    url = `${base_url}?offset=${offset}&limit=${limit}`;
  }

  if (query) {
    url += `&query=${query}`;
  }

  try {
    const response = await api.get(url);
    if (response.data.success) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getTotalCount = async (status: string | undefined = undefined) => {
  try {
    const url = status
      ? `/api/v1/search-queries/get-search-queries-count?status=${status}`
      : "/api/v1/search-queries/get-search-queries-count";

    const response = await api.get(url);
    return response.data.success ? response.data.data : 0;
  } catch (error) {
    console.error("Error fetching total count:", error);
    throw error;
  }
};

export const addQuery = async (query: QueryCreateSchema) => {
  try {
    const url = "/api/v1/search-queries/add-search-query";
    const response = await api.post(url, query);
    return response.data.success;
  } catch (error) {
    console.error("Error adding search query:", error);
    throw error;
  }
};

export const deleteQueries = async (queryIds: string[]) => {
  console.log("Deleting queries with IDs:", queryIds);
  try {
    const url = "/api/v1/search-queries/delete-search-queries";
    const response = await api.delete(url, {
      data: { ids: queryIds },
    });
    return response.data.success;
  } catch (error) {
    console.error("Error deleting search queries:", error);
    throw error;
  }
};
