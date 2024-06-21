import { useState } from "react";
import { MainPage } from "./Main/MainPage.tsx";
import "./theme/variables.css";
import { Route, Routes } from "react-router-dom";
import { ReadBook } from "./comp/ReadBook.tsx";
import EpubReader from "./EpubViewer.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/read" element={<EpubReader url={'http://localhost:3002/carl.epub'} />} />
      </Routes>
    </>
  );
}

export default App;
