import { VideoGameSchema } from "@/types";
import { api } from "@/utils/api";

export const getVideoGames = async (
  offset: number,
  limit: number,
  title: string
) => {
  let url = "";
  const base_url = "/api/v1/video-games/list-video-games";
  url = `${base_url}?offset=${offset}&limit=${limit}`;

  if (title) {
    url = `${base_url}?offset=${offset}&limit=${limit}&title=${title}`;
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

export const getTotalCount = async () => {
  try {
    const url = "/api/v1/video-games/get-video-games-count";

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
