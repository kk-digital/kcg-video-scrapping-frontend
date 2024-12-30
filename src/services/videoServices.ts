import { api } from "@/utils/api";

export const getIngressVideos = async (
  offset: number,
  limit: number,
  title: string = "",
  status: string | undefined = undefined
) => {
  let url = "";
  if (status) {
    url = `/api/v1/ingress-videos/list-ingress-videos?offset=${offset}&limit=${limit}&status=${status}`;
  } else {
    url = `/api/v1/ingress-videos/list-ingress-videos?offset=${offset}&limit=${limit}`;
  }

  if (title) {
    url += `&title=${title}`;
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

export const getVideoById = async (id: string) => {
  return await api.get(`/api/v1/ingress-videos/${id}`);
};

export const getTotalCount = async (status: string | undefined = undefined) => {
  try {
    const url = status
      ? `/api/v1/ingress-videos/get-ingress-videos-count?status=${status}`
      : "/api/v1/ingress-videos/get-ingress-videos-count";

    const response = await api.get(url);
    return response.data.success ? response.data.data : 0;
  } catch (error) {
    console.error("Error fetching total count:", error);
    throw error;
  }
};
