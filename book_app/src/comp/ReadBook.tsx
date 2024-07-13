import axios from "axios";
import React from "react";
import "./css/readBook.scss";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import EpubViewer from "../EpubViewer.tsx";
// import { WebView } from "react-webview";
// import "C:/Users/Vikleo/Desktop/books/Eric-Jorgenson_The-Almanack-of-Naval-Ravikant_EBOOK_v103/OEBPS/css/style.css";



export const ReadBook = () => {
  const { id } = useParams();
  const [url, seturl] = useState(null);
  useEffect(() => {
    let base = "http://localhost:3002/";
    let m = async () => {
      let d = await axios.get(base + "Read?id=" + id );

      seturl(d.data.url);
    };

    m();
  }, []);

 if(url !== null){
  return (
    <EpubViewer bkid = {id} url={url} />
  );
 }
};


