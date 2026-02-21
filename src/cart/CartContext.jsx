import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "streamlist_cart_v1";

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function loadCart() {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? safeParse(raw, []) : [];
}

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const p = action.payload;
      if (!p?.id) return state;

      const title = p.title ?? p.name ?? "Untitled";
      const price = Number(p.price ?? 0);

      const existing = state.find((x) => x.id === p.id);
      if (existing) {
        return state.map((x) =>
          x.id === p.id ? { ...x, quantity: x.quantity + 1 } : x
        );
      }

      return [
        ...state,
        {
          id: p.id,
          title,
          price: Number.isFinite(price) ? price : 0,
          quantity: 1,
          image: p.image ?? p.poster ?? p.thumbnail ?? "",
        },
      ];
    }

    case "REMOVE_ITEM":
      return state.filter((x) => x.id !== action.payload);

    case "SET_QTY": {
      const { id, quantity } = action.payload || {};
      const q = Math.max(1, parseInt(quantity, 10) || 1);
      return state.map((x) => (x.id === id ? { ...x, quantity: q } : x));
    }

    case "INC_QTY":
      return state.map((x) =>
        x.id === action.payload ? { ...x, quantity: x.quantity + 1 } : x
      );

    case "DEC_QTY":
      return state.map((x) =>
        x.id === action.payload
          ? { ...x, quantity: Math.max(1, x.quantity - 1) }
          : x
      );

    case "CLEAR":
      return [];

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  // ✅ Key fix: load from localStorage BEFORE first render finishes
  const [cart, dispatch] = useReducer(cartReducer, [], () => loadCart());

  // ✅ Save to localStorage on every change (now it won’t wipe at startup)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const api = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return {
      cart,
      subtotal,
      itemCount,
      addToCart: (product) => dispatch({ type: "ADD_ITEM", payload: product }),
      removeFromCart: (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
      setQuantity: (id, quantity) => dispatch({ type: "SET_QTY", payload: { id, quantity } }),
      incQuantity: (id) => dispatch({ type: "INC_QTY", payload: id }),
      decQuantity: (id) => dispatch({ type: "DEC_QTY", payload: id }),
      clearCart: () => dispatch({ type: "CLEAR" }),
    };
  }, [cart]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider />");
  return ctx;
}
