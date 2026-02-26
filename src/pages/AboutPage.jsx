// src/pages/AboutPage.jsx
import React from "react";

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: "1rem" }}>
      <div
        style={{
          background: "#ffffff",
          color: "#111827",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "1.5rem",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        }}
      >
        <h1 style={{ marginTop: 0 }}>About This Project</h1>
        <p style={{ color: "#4b5563", lineHeight: 1.6 }}>
          This application is a React-based <strong>Security and Credit Card Management System</strong>{" "}
          integrated into the StreamList app. It demonstrates secure user access using OAuth login,
          protected routing, and a credit card management workflow connected to the shopping cart checkout process.
        </p>

        <section style={{ marginTop: "1.25rem" }}>
          <h2 style={h2Style}>Project Purpose</h2>
          <p style={pStyle}>
            The purpose of this project is to ensure users must authenticate before accessing the
            main application and to provide a functional credit card entry page that validates and
            stores card information locally for assignment demonstration purposes.
          </p>
        </section>

        <section style={{ marginTop: "1.25rem" }}>
          <h2 style={h2Style}>Features Implemented</h2>
          <ul style={listStyle}>
            <li>Google OAuth login integration</li>
            <li>Protected routes that redirect unauthenticated users to the login page</li>
            <li>Automatic redirect to the main interface after successful login</li>
            <li>Shopping cart checkout button routes to the Credit Card Management page</li>
            <li>Credit card number formatting in the required format: <code>1234 5678 9012 3456</code></li>
            <li>Credit card data saved to <code>localStorage</code> for assignment demo verification</li>
            <li>Cart and authentication persistence using <code>localStorage</code></li>
          </ul>
        </section>

        <section style={{ marginTop: "1.25rem" }}>
          <h2 style={h2Style}>How to Use</h2>
          <ol style={listStyle}>
            <li>Sign in using the Google OAuth login page.</li>
            <li>Navigate through the app and add items to the cart.</li>
            <li>Open the cart and click <strong>Checkout</strong>.</li>
            <li>Enter credit card details on the Credit Card Management page.</li>
            <li>Save the card to store the demo data in localStorage.</li>
          </ol>
        </section>

        <section style={{ marginTop: "1.25rem" }}>
          <h2 style={h2Style}>Tech Stack</h2>
          <ul style={listStyle}>
            <li>React (Vite)</li>
            <li>React Router</li>
            <li>Google OAuth (<code>@react-oauth/google</code>)</li>
            <li>Browser localStorage</li>
            <li>Context API (Auth + Cart state management)</li>
          </ul>
        </section>

        <section style={{ marginTop: "1.25rem" }}>
          <h2 style={h2Style}>Important Note</h2>
          <p style={pStyle}>
            This project is a classroom demonstration. Card data is stored in <code>localStorage</code>{" "}
            only to satisfy assignment requirements. <strong>Use test/fake card information only</strong> and
            do not use real payment card details.
          </p>
        </section>
      </div>
    </div>
  );
}

const h2Style = {
  margin: "0 0 0.5rem 0",
  fontSize: "1.1rem",
  color: "#111827",
};

const pStyle = {
  margin: 0,
  color: "#4b5563",
  lineHeight: 1.6,
};

const listStyle = {
  margin: "0.25rem 0 0 1.25rem",
  color: "#374151",
  lineHeight: 1.7,
};