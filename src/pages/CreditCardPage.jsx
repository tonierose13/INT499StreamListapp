// src/pages/CreditCardPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const CARD_STORAGE_KEY = "streamlist_credit_card_v1";

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function maskCardNumber(number) {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 4) return "**** **** **** ****";
  return `**** **** **** ${digits.slice(-4)}`;
}

export default function CreditCardPage() {
  const [form, setForm] = useState({
    cardholderName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CARD_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm({
          cardholderName: parsed.cardholderName || "",
          cardNumber: parsed.cardNumber || "",
          expiry: parsed.expiry || "",
          cvv: parsed.cvv || "",
        });
      }
    } catch (error) {
      console.error("Failed to load saved card:", error);
    }
  }, []);

  const cardNumberValid = useMemo(
    () => /^\d{4} \d{4} \d{4} \d{4}$/.test(form.cardNumber),
    [form.cardNumber]
  );

  const expiryValid = useMemo(
    () => /^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry),
    [form.expiry]
  );

  const cvvValid = useMemo(() => /^\d{3,4}$/.test(form.cvv), [form.cvv]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage("");

    if (name === "cardNumber") {
      setForm((prev) => ({ ...prev, cardNumber: formatCardNumber(value) }));
      return;
    }

    if (name === "expiry") {
      setForm((prev) => ({ ...prev, expiry: formatExpiry(value) }));
      return;
    }

    if (name === "cvv") {
      const digits = value.replace(/\D/g, "").slice(0, 4);
      setForm((prev) => ({ ...prev, cvv: digits }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!form.cardholderName.trim()) {
      setMessage("Please enter the cardholder name.");
      return;
    }

    if (!cardNumberValid) {
      setMessage("Card number must be in format 1234 5678 9012 3456.");
      return;
    }

    if (!expiryValid) {
      setMessage("Expiry must be in MM/YY format.");
      return;
    }

    if (!cvvValid) {
      setMessage("CVV must be 3 or 4 digits.");
      return;
    }

    // Assignment demo only: save to localStorage (use test data only)
    localStorage.setItem(CARD_STORAGE_KEY, JSON.stringify(form));
    setMessage(`Card saved successfully (${maskCardNumber(form.cardNumber)})`);
  };

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "1rem" }}>
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: "1.25rem",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
          color: "#111827",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Credit Card Management</h1>
        <p style={{ color: "#4b5563", marginTop: "-0.25rem" }}>
          Enter and save your card information (assignment demo).
        </p>

        <form onSubmit={handleSave} style={{ display: "grid", gap: "0.9rem" }}>
          <div>
            <label htmlFor="cardholderName" style={{ display: "block", marginBottom: 6 }}>
              Cardholder Name
            </label>
            <input
              id="cardholderName"
              name="cardholderName"
              type="text"
              value={form.cardholderName}
              onChange={handleChange}
              placeholder="Jane Doe"
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="cardNumber" style={{ display: "block", marginBottom: 6 }}>
              Card Number
            </label>
            <input
              id="cardNumber"
              name="cardNumber"
              type="text"
              inputMode="numeric"
              value={form.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              style={inputStyle}
            />
            <small style={{ color: "#6b7280" }}>
              Required format: 1234 5678 9012 3456
            </small>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.9rem" }}>
            <div>
              <label htmlFor="expiry" style={{ display: "block", marginBottom: 6 }}>
                Expiry (MM/YY)
              </label>
              <input
                id="expiry"
                name="expiry"
                type="text"
                inputMode="numeric"
                value={form.expiry}
                onChange={handleChange}
                placeholder="09/28"
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="cvv" style={{ display: "block", marginBottom: 6 }}>
                CVV
              </label>
              <input
                id="cvv"
                name="cvv"
                type="password"
                inputMode="numeric"
                value={form.cvv}
                onChange={handleChange}
                placeholder="123"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem" }}>
            <button type="submit" style={buttonPrimary}>
              Save Card
            </button>
            <Link to="/cart" style={buttonSecondary}>
              Back to Cart
            </Link>
          </div>

          {message ? (
            <p
              style={{
                margin: 0,
                color: message.toLowerCase().includes("successfully") ? "#065f46" : "#b91c1c",
                background: message.toLowerCase().includes("successfully")
                  ? "#ecfdf5"
                  : "#fef2f2",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: "0.75rem",
              }}
            >
              {message}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.7rem 0.8rem",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  outline: "none",
  fontSize: "0.95rem",
  boxSizing: "border-box",
};

const buttonPrimary = {
  background: "#111827",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "0.7rem 1rem",
  cursor: "pointer",
  fontWeight: 600,
};

const buttonSecondary = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  color: "#111827",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  padding: "0.7rem 1rem",
  fontWeight: 500,
};