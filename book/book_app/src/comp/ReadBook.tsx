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
      console.log(dd.ch);
      setdata(dd.ch);
      injectCSS(dd.link);
      base(dd.base);
    };

    m();
  }, [index]);
  const injectCSS = (cssString) => {
    const style = document.createElement("style");
    style.type = "text/css";

    if (style.styleSheet) {
      // This is required for IE8 and below.
      style.styleSheet.cssText = cssString;
    } else {
      style.appendChild(document.createTextNode(cssString));
    }

    document.head.appendChild(style);
  };

  const base = (pth) => {
    const baseTag = document.createElement("base");

    // Set the href attribute of the base tag
    baseTag.setAttribute("href", pth);

    // Get the head element of the document
    const headElement =
      document.head || document.getElementsByTagName("head")[0];

    // Append the base tag to the head element
    headElement.appendChild(baseTag);
  };

  const customStyles = `
    body {
      background-color: #000000 !important ;
      font-family: Arial, sans-serif;
    }
    h2 {
      color: #333;
    }
  `;

  return (
    <div>
      <p className=" text-3xl text-center w-[100vw] bg-slate-300 text-black ">
        {id}
      </p>
      {/* <div
        dangerouslySetInnerHTML={{ __html: data }}
        className=" w-[100vw] h-[100vh]  inline-block space-y-0  items-center   overscroll-auto h-screen overflow-scroll  text-black bg-slate-100 "
      ></div> */}
      <div className=" w-[100vw] ">
        <HtmlViewer
          src={"http://localhost:3002/" + data}
          styles={customStyles}
        />
      </div>
    </div>
  );
};

const HtmlViewer = ({ src, styles }) => {
  const iframeRef = useRef(null);

  const moveThing = () => {
    window.addEventListener("message", function (event) {
      console.log("parent calling the child method");
    });

    const iframeWindow = document.getElementById("iframe").contentWindow;
    iframeWindow.postMessage("", "*");
  };

  return (
    <>
      <button onClick={moveThing}>Move</button>
      <iframe
        ref={iframeRef}
        id="pain"
        title="HTML Viewer"
        src={src}
        style={{ width: "100%", height: "100vh", border: "none" }}
      ></iframe>
    </>
  );
};
