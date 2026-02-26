// src/pages/CartPage.jsx
import "./CartPage.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../cart/CartContext";

export default function CartPage() {
  const navigate = useNavigate();

  const {
    cart,
    subtotal,
    itemCount,
    removeFromCart,
    incQuantity,
    decQuantity,
    setQuantity,
    clearCart,
  } = useCart();

  const handleCheckout = () => {
    navigate("/credit-card");
  };

  return (
    <div className="cart-wrap">
      <header className="cart-header">
        <div>
          <h1 className="cart-title">Your Cart</h1>
          <p className="cart-subtitle">{itemCount} item(s) in cart • saved automatically</p>
        </div>

        <button className="cart-btn ghost" onClick={clearCart} disabled={cart.length === 0}>
          Clear Cart
        </button>
      </header>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <h2>Cart is empty</h2>
          <p>Add movies or StreamList items to see them here.</p>
        </div>
      ) : (
        <div className="cart-grid">
          <section className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-row">
                {item.image ? (
                  <img className="cart-thumb" src={item.image} alt={item.title} />
                ) : (
                  <div className="cart-thumb fallback" />
                )}

                <div className="cart-row-main">
                  <div className="cart-row-top">
                    <div>
                      <div className="cart-item-title">{item.title}</div>
                      <div className="cart-meta">
                        Unit: <span className="mono">${Number(item.price).toFixed(2)}</span>
                      </div>
                    </div>

                    <button className="cart-btn danger" onClick={() => removeFromCart(item.id)}>
                      Remove
                    </button>
                  </div>

                  <div className="cart-row-bottom">
                    <div className="qty">
                      <button
                        className="qty-btn"
                        onClick={() => decQuantity(item.id)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>

                      <input
                        className="qty-input"
                        value={item.quantity}
                        onChange={(e) => setQuantity(item.id, e.target.value)}
                        inputMode="numeric"
                      />

                      <button className="qty-btn" onClick={() => incQuantity(item.id)}>
                        +
                      </button>
                    </div>

                    <div className="cart-line-total">
                      Line total:{" "}
                      <span className="mono">
                        ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <aside className="cart-summary">
            <h2 className="summary-title">Summary</h2>

            <div className="summary-row">
              <span>Items</span>
              <span className="mono">{itemCount}</span>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span className="mono">${Number(subtotal).toFixed(2)}</span>
            </div>

            <div className="divider" />

            <div className="summary-row total">
              <span>Total</span>
              <span className="mono">${Number(subtotal).toFixed(2)}</span>
            </div>

            <button className="cart-btn primary" onClick={handleCheckout}>
              Checkout
            </button>

            <p className="summary-note">Cart persists in localStorage even after refresh.</p>
          </aside>
        </div>
      )}
    </div>
  );
}