import { NextResponse } from "next/server";
import cities from "../../public/data/cities.json";

type City = {
  city: string;
  country: string;
  continent: string;
};

type CityChoice = Pick<City, "city" | "country">;

type WikipediaSummary = {
  title?: string;
  extract?: string;
  originalimage?: {
    source?: string;
  };
};

const cityList = cities as City[];

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

export async function GET() {
  const selected = cityList[Math.floor(Math.random() * cityList.length)];
  const title = encodeURIComponent(selected.city.replace(/ /g, "_"));
  const wikipediaUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;

  const response = await fetch(wikipediaUrl, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: `Wikipedia could not find ${selected.city}.` },
      { status: 502 },
    );
  }

  const summary = (await response.json()) as WikipediaSummary;
  const distractors = cityList
    .filter((city) => city.city !== selected.city || city.country !== selected.country)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const choices = shuffle<CityChoice>([
    { city: selected.city, country: selected.country },
    ...distractors.map(({ city, country }) => ({ city, country })),
  ]);

  return NextResponse.json({
    city: selected.city,
    country: selected.country,
    photoUrl: summary.originalimage?.source ?? null,
    photoAlt: summary.extract ?? `A photo of ${selected.city}, ${selected.country}`,
    choices,
  });
}
