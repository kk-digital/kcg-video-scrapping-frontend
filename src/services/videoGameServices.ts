import { VideoGameSchema } from "@/types";
import { api } from "@/utils/api";

interface FetchVideoGamesProps {
  offset: number;
  limit: number;
  title?: string;
  fromDate?: string;
  toDate?: string;
  orderBy?: string;
  isAscending?: boolean;
}

export const getVideoGames = async (
  data: FetchVideoGamesProps = { offset: 0, limit: 20 }
) => {
  const { offset, limit, title, fromDate, toDate, orderBy, isAscending } = data;
  let url = "";
  const base_url = "/api/v1/video-games/list-video-games";

  url = `${base_url}?offset=${offset}&limit=${limit}`;

  if (title) {
    url += `&title=${title}`;
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
  title,
  fromDate,
  toDate,
}: {
  title?: string;
  fromDate?: string;
  toDate?: string;
}) => {
  try {
    let url = "/api/v1/video-games/get-video-games-count?";

    if (title) {
      url += `&title=${title}`;
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

export const addVideoGame = async (videoGame: VideoGameSchema) => {
  try {
    const url = "/api/v1/video-games/add-video-game";
    const response = await api.post(url, videoGame);
    console.log(response.data);
    return response.data.success;
  } catch (error) {
    console.error("Error adding video game:", error);
    throw error;
  }
};

export const deleteVideoGame = async (id: string) => {
  try {
    const url = `/api/v1/video-games/delete-video-game?game_id=${id}`;
    const response = await api.delete(url);
    return response.data.success;
  } catch (error) {
    console.error("Error deleting video game:", error);
    throw error;
  }
};

export const deleteVideoGames = async (videoGameIds: string[]) => {
  try {
    const url = "/api/v1/video-games/delete-video-games";
    const response = await api.delete(url, {
      data: { ids: videoGameIds },
    });
    console.log(response.data);
    return response.data.success;
  } catch (error) {
    console.error("Error deleting video games:", error);
    throw error;
  }
};
