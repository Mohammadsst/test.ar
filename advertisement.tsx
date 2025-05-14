import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { Slider } from "../types";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const GetHeroSliders = async (): Promise<Slider[]> => {
  const response: AxiosResponse<Slider[]> = await axios.get(
    `${BACKEND_URL}/en/api/advertisement/hero-sliders/`
  );
  return response.data;
};

export function useGetHeroSliders() {
  return useQuery({
    queryKey: ["heroSliders"],
    queryFn: GetHeroSliders,
    refetchOnWindowFocus: false,
  });
}

// Get Hero Sliders
