import { useEffect, useState } from "react";
import { searchMovies, posterUrl } from "../services/tmdb";

const LS_QUERY = "streamlist.movies.query";
const LS_RESULTS = "streamlist.movies.results";

export default function MoviesPage() {
  const [hydrated, setHydrated] = useState(false);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [error, setError] = useState("");

  // 1) Load saved state ONCE (rehydrate) on refresh
  useEffect(() => {
    try {
      const savedQuery = localStorage.getItem(LS_QUERY);
      const savedResultsRaw = localStorage.getItem(LS_RESULTS);

      const parsedResults = savedResultsRaw ? JSON.parse(savedResultsRaw) : [];

      if (typeof savedQuery === "string") setQuery(savedQuery);
      if (Array.isArray(parsedResults)) setResults(parsedResults);
    } catch {
      // ignore parse/storage errors
    } finally {
      // IMPORTANT: prevents saving empty defaults before we finish loading
      setHydrated(true);
    }
  }, []);

  // 2) Save state AFTER hydration (prevents refresh wipe)
  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(LS_QUERY, query);
      localStorage.setItem(LS_RESULTS, JSON.stringify(results));
    } catch {
      // ignore storage errors (quota/private mode)
    }
  }, [hydrated, query, results]);

  async function onSearch(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setStatus("loading");
    setError("");

    try {
      const data = await searchMovies(q);
      const list = Array.isArray(data?.results) ? data.results : [];
      setResults(list);
      setStatus("idle");
    } catch (err) {
      setError(err?.message || "Failed to fetch movies.");
      setStatus("error");
    }
  }

  function onClear() {
    setQuery("");
    setResults([]);
    setStatus("idle");
    setError("");

    try {
      localStorage.removeItem(LS_QUERY);
      localStorage.removeItem(LS_RESULTS);
    } catch {
      // ignore
    }
  }

  return (
    <section className="card">
      <h2>Movies</h2>
      <p className="muted">
        Search TMDB and review movie info. Refresh-safe using localStorage.
      </p>

      <form
        onSubmit={onSearch}
        style={{ display: "flex", gap: 10, marginTop: 12 }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a title… (ex: Titanic)"
          style={{ flex: 1, padding: 10, borderRadius: 10 }}
        />

        <button
          type="submit"
          disabled={status === "loading"}
          style={{ padding: "10px 14px" }}
        >
          {status === "loading" ? "Searching…" : "Search"}
        </button>

        <button
          type="button"
          onClick={onClear}
          style={{ padding: "10px 14px" }}
        >
          Clear
        </button>
      </form>

      {status === "error" && (
        <p style={{ color: "crimson", marginTop: 10 }}>{error}</p>
      )}

      <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
        {results.map((m) => {
          const imgSrc = posterUrl(m.poster_path); // may be null/undefined
          return (
            <article
              key={m.id}
              style={{
                display: "grid",
                gridTemplateColumns: imgSrc ? "92px 1fr" : "1fr",
                gap: 12,
                padding: 12,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* ✅ Fix console warning: only render img if we have a real src */}
              {imgSrc && (
                <img
                  src={imgSrc}
                  alt={m.title || "Movie poster"}
                  style={{ width: 92, borderRadius: 10 }}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <h3 style={{ margin: 0 }}>{m.title}</h3>
                  <span className="muted" style={{ whiteSpace: "nowrap" }}>
                    {m.release_date ? m.release_date.slice(0, 4) : "N/A"}
                  </span>
                </div>

                <div className="muted" style={{ marginTop: 4 }}>
                  Rating: {m.vote_average ?? "N/A"} / 10
                </div>

                <p style={{ marginTop: 8 }}>
                  {(m.overview || "No overview available.").slice(0, 180)}
                  {m.overview && m.overview.length > 180 ? "…" : ""}
                </p>
              </div>
            </article>
          );
        })}

        {status !== "loading" && results.length === 0 && (
          <p className="muted" style={{ marginTop: 8 }}>
            No results yet. Search above.
          </p>
        )}
      </div>
    </section>
  );
}
