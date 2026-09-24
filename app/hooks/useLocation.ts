import { useQuery } from "@tanstack/react-query";

export type LocationData = {
  city: string;
  country: string;
  photoUrl: string | null;
  photoAlt: string;
  choices: Array<{
    city: string;
    country: string;
  }>;
};

async function fetchLocation(): Promise<LocationData> {
  const response = await fetch("/api/location", { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Unable to load this field report");
  }

  return response.json() as Promise<LocationData>;
}

export function useLocation(roundKey: string) {
  return useQuery({
    queryKey: ["location", roundKey],
    queryFn: fetchLocation,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
