import { $host } from "./index";

export const fetchTours = async () => {
  try {
    const { data } = await $host.get('api/tour');
    return data;
  } catch (error) {
    console.error("Error fetching tours:", error);
    throw error;
  }
};