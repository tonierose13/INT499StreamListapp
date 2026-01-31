import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import StreamListPage from "./pages/StreamListPage.jsx";
import MoviesPage from "./pages/MoviesPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<StreamListPage />} />
        <Route path="movies" element={<MoviesPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}
