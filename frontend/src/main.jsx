import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThirdwebProvider } from "@thirdweb-dev/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThirdwebProvider activeChain="sepolia" clientId={"cb6c109e0e313cf31650231588027d04"}>
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);
