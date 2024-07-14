import { useState } from "react";
import { MainPage } from "./Main/MainPage.tsx";
import "./theme/variables.css";
import { Route, Routes } from "react-router-dom";
import { ReadBook } from "./comp/ReadBook.tsx";
import EpubReader from "./EpubViewertest.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/read/:id" element={<ReadBook  />} />
      </Routes>
    </>
  );
}

export default App;
