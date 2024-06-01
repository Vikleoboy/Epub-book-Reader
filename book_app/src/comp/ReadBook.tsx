import axios from "axios";
import React from "react";
import "./css/readBook.scss";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
// import { WebView } from "react-webview";
// import "C:/Users/Vikleo/Desktop/books/Eric-Jorgenson_The-Almanack-of-Naval-Ravikant_EBOOK_v103/OEBPS/css/style.css";

export const ReadBook = () => {
  const { id } = useParams();
  const [index, setindex] = useState(7);
  const [data, setdata] = useState(null);
  useEffect(() => {
    let url = "http://localhost:3002/";
    let m = async () => {
      let d = await axios.get(url + "Read/" + id + "/" + index);
      let dd = JSON.parse(d.data);

      setdata(dd.ch);
    };

    m();
  }, [index]);

  return (
    <div>
      <p className=" text-3xl text-center w-[100vw] bg-slate-300 text-black ">
        {id}
      </p>

      <div className=" w-[100vw] ">
        <HtmlViewer src={data} />
      </div>
    </div>
  );
};

const HtmlViewer = ({ src, styles }) => {
  return (
    <>
      <iframe
        id="pain"
        title="HTML Viewer"
        srcDoc={src}
        style={{ width: "100%", height: "100vh", border: "none" }}
      ></iframe>
    </>
  );
};
