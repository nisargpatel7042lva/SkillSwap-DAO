import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css';

console.log('main.tsx: script loaded');

// Use non-strict mode for better performance in production
const renderApp = () => (
    <App />
);

console.log('main.tsx: about to render app');
ReactDOM.createRoot(document.getElementById("root")!).render(renderApp());
console.log('main.tsx: app rendered');
