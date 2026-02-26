import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useCart } from "../cart/CartContext";
import { useAuth } from "../auth/AuthContext";

export default function Layout() {
  const { itemCount } = useCart();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

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
            Cart {itemCount > 0 ? <span className="cartBadge">{itemCount}</span> : null}
          </NavLink>

          <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
            About
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              marginLeft: "0.5rem",
              padding: "0.4rem 0.7rem",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
            title={user?.name ? `Signed in as ${user.name}` : "Logout"}
          >
            Logout
          </button>
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