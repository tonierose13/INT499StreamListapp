import { useState } from "react";

export default function StreamListPage() {
  const [item, setItem] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("StreamList input:", item); // ✅ Week 1 requirement
    setItem("");
  };

  return (
    <section className="card">
      <h2>StreamList (Home)</h2>
      <p className="muted">
        Type a movie/show and submit. Then open DevTools → Console to see it logged.
      </p>

      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="streamItem" className="label">
          Enter a movie/show:
        </label>

        <div className="row">
          <input
            id="streamItem"
            className="input"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="Example: Inception"
            required
          />
          <button className="btn" type="submit">
            Submit
          </button>
        </div>
      </form>
    </section>
  );
}
