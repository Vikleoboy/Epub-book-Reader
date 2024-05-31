import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "@ionic/react/css/core.css";

import { MainPage } from "./Main/MainPage.tsx";

import { IonApp, setupIonicReact } from "@ionic/react";

import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
setupIonicReact({
  mode: "ios",
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
