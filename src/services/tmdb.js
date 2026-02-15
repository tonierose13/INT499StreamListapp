const BASE = "https://api.themoviedb.org/3";
const READ_TOKEN = import.meta.env.VITE_TMDB_READ_TOKEN;

async function tmdbFetch(path, params = {}) {
  if (!READ_TOKEN) throw new Error("Missing VITE_TMDB_READ_TOKEN in .env");

  const url = new URL(`${BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  });

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${READ_TOKEN}`,
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB ${res.status}: ${text}`);
  }
  return res.json();
}

export async function searchMovies(query) {
  return tmdbFetch("/search/movie", {
    query,
    include_adult: "false",
    language: "en-US",
    page: "1",
  });
}

export function posterUrl(path, size = "w185") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}
