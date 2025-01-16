import { QueryCreateSchema } from "@/types";
import { api } from "@/utils/api";

interface FetchQueriesProps {
  offset: number;
  limit: number;
  query?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  orderBy?: string;
  isAscending?: boolean;
}

export const getQueries = async (
  data: FetchQueriesProps = { offset: 0, limit: 20 }
) => {
  const {
    offset,
    limit,
    query,
    status,
    fromDate,
    toDate,
    orderBy,
    isAscending,
  } = data;
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

  if (orderBy) {
    url += `&order_by=${orderBy}`;
  }
  if (isAscending !== undefined) {
    url += `&is_ascending=${isAscending}`;
  }
  if (fromDate) {
    url += `&from_date=${fromDate}`;
  }
  if (toDate) {
    url += `&to_date=${toDate}`;
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

export const getTotalCount = async ({
  query,
  status,
  fromDate,
  toDate,
}: {
  query?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}) => {
  try {
    let url = "";
    const base_url = "/api/v1/search-queries/get-search-queries-count";
    if (status) {
      url = `${base_url}?&status=${status}`;
    } else {
      url = `${base_url}?`;
    }
    if (query) {
      url += `&query=${query}`;
    }
    if (fromDate) {
      url += `&from_date=${fromDate}`;
    }
    if (toDate) {
      url += `&to_date=${toDate}`;
    }

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

export const deleteQuery = async (id: string) => {
  try {
    const url = `/api/v1/search-queries/delete-search-query?query_id=${id}`;
    const response = await api.delete(url);
    return response.data.success;
  } catch (error) {
    console.error("Error deleting query:", error);
    throw error;
  }
};
