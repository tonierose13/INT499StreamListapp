// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import StreamListPage from "./pages/StreamListPage.jsx";
import MoviesPage from "./pages/MoviesPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CreditCardPage from "./pages/CreditCardPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";

import { AuthProvider } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<StreamListPage />} />
            <Route path="movies" element={<MoviesPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="credit-card" element={<CreditCardPage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}