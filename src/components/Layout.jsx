import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <h1>StreamList</h1>
          <p className="subtitle">EZTechMovie • Week 1</p>
        </div>

        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            StreamList
          </NavLink>
          <NavLink to="/movies" className={({ isActive }) => (isActive ? "active" : "")}>
            Movies
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => (isActive ? "active" : "")}>
            Cart
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
            About
          </NavLink>
        </nav>
      </header>

      <main className="content">
        <Outlet />
      </main>

      <footer className="footer">
        <small>StreamList Prototype</small>
      </footer>
    </div>
  );
}
