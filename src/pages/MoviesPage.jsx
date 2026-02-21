import { useEffect, useState } from "react";
import { useCart } from "../cart/CartContext";
import { searchMovies, posterUrl } from "../services/tmdb";

const LS_QUERY = "streamlist.movies.query";
const LS_RESULTS = "streamlist.movies.results";

export default function MoviesPage() {
  const [hydrated, setHydrated] = useState(false);

  const { addToCart } = useCart();
  const MOVIE_PRICE = 4.99;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [error, setError] = useState("");

  // holds restored results but doesn't display them until user searches
  const [savedResults, setSavedResults] = useState([]);
  const [hasSaved, setHasSaved] = useState(false);

  // 1) Load saved state ONCE (rehydrate) on refresh
  useEffect(() => {
    try {
      const savedQuery = localStorage.getItem(LS_QUERY);
      const savedResultsRaw = localStorage.getItem(LS_RESULTS);

      const parsedResults = savedResultsRaw ? JSON.parse(savedResultsRaw) : [];

      if (typeof savedQuery === "string") setQuery(savedQuery);

      // store restored results separately (not shown yet)
      if (Array.isArray(parsedResults) && parsedResults.length > 0) {
        setSavedResults(parsedResults);
        setHasSaved(true);
      }
    } catch {
      // ignore parse/storage errors
    } finally {
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

      // once the user searches, we stop “saved mode”
      setSavedResults([]);
      setHasSaved(false);

      setStatus("idle");
    } catch (err) {
      setError(err?.message || "Failed to fetch movies.");
      setStatus("error");
    }
  }

  function onClear() {
    setQuery("");
    setResults([]);
    setSavedResults([]);
    setHasSaved(false);
    setStatus("idle");
    setError("");

    try {
      localStorage.removeItem(LS_QUERY);
      localStorage.removeItem(LS_RESULTS);
    } catch {
      // ignore
    }
  }

  // choose what to render:
  // - if we have saved results but user hasn't searched yet => show message only
  // - once user searches => show results
  const showResults = !hasSaved; // results visible only after user searches
  const renderList = results;

  return (
    <section className="card">
      <h2>Movies</h2>
      <p className="muted">
        Search TMDB and review movie info. Refresh-safe using localStorage.
      </p>

      <form onSubmit={onSearch} style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a title… (ex: Titanic)"
          style={{ flex: 1, padding: 10, borderRadius: 10 }}
        />

        <button type="submit" disabled={status === "loading"} style={{ padding: "10px 14px" }}>
          {status === "loading" ? "Searching…" : "Search"}
        </button>

        <button type="button" onClick={onClear} style={{ padding: "10px 14px" }}>
          Clear
        </button>
      </form>

      {status === "error" && <p style={{ color: "crimson", marginTop: 10 }}>{error}</p>}

      {/* Saved-results gate */}
      {hasSaved && status !== "loading" && (
        <p className="muted" style={{ marginTop: 12 }}>
          Saved results are available from your last session. Click{" "}
          <strong>Search</strong> to display them or refresh the list.
        </p>
      )}

      <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
        {showResults &&
          renderList.map((m) => {
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
                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt={m.title || "Movie poster"}
                    style={{ width: 92, borderRadius: 10 }}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
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

                  {/* NEW: Price + Add to Cart */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      marginTop: 10,
                    }}
                  >
                    <span className="muted" style={{ fontWeight: 700 }}>
                      Price: ${MOVIE_PRICE.toFixed(2)}
                    </span>

                    <button
                      className="btn"
                      type="button"
                      onClick={() =>
                        addToCart({
                          id: `movie-${m.id}`, // prefix prevents collisions
                          title: m.title || "Untitled",
                          price: MOVIE_PRICE,
                          image: imgSrc || "",
                        })
                      }
                    >
                      Add to Cart (${MOVIE_PRICE.toFixed(2)})
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

        {status !== "loading" && showResults && renderList.length === 0 && (
          <p className="muted" style={{ marginTop: 8 }}>
            No results yet. Search above.
          </p>
        )}
      </div>
    </section>
  );
}
