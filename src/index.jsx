import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import BusinessProvider from "./context/BusinessContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BusinessProvider>
      <App />
    </BusinessProvider>
  </React.StrictMode>
);
