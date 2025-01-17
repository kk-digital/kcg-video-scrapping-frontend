import { INGRESS_VIDEO_STATUS } from "@/types/enums";
import { api } from "@/utils/api";

interface FetchIngressVideoProps {
  offset: number;
  limit: number;
  title?: string;
  status: string | null;
  orderBy?: string;
  isAscending?: boolean;
}

export const getIngressVideos = async (
  data: FetchIngressVideoProps = { offset: 0, limit: 20, status: null }
) => {
  const { offset, limit, title, status, orderBy, isAscending } = data;
  let url = "";
  if (status) {
    url = `/api/v1/ingress-videos/list-ingress-videos?offset=${offset}&limit=${limit}&status=${status}`;
  } else {
    url = `/api/v1/ingress-videos/list-ingress-videos?offset=${offset}&limit=${limit}`;
  }
  if (orderBy) {
    url += `&order_by=${orderBy}`;
  }
  if (isAscending !== undefined) {
    url += `&is_ascending=${isAscending}`;
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

export const getTotalCount = async (
  status: INGRESS_VIDEO_STATUS | null = null,
  title?: string
) => {
  try {
    console.log(status);
    let url = status
      ? `/api/v1/ingress-videos/get-ingress-videos-count?status=${status}`
      : "/api/v1/ingress-videos/get-ingress-videos-count";
    if (title) {
      url += `&title=${title}`;
    }
    const response = await api.get(url);
    return response.data.success ? response.data.data : 0;
  } catch (error) {
    console.error("Error fetching total count:", error);
    throw error;
  }
};

export const retryDownloadingVideos = async (
  ids: string[]
): Promise<boolean> => {
  try {
    const response = await api.post(
      "/api/v1/ingress-videos/retry-downloading-ingress-video",
      {
        ids,
      }
    );
    return response.data.success;
  } catch (error) {
    console.error("Error fetching total count:", error);
    return false;
  }
};
