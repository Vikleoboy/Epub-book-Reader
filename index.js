// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("path");
const express = require("express");
const fs = require("fs");
const Router = express();
const AdmZip = require("adm-zip");
const cheerio = require("cheerio");
const { uid } = require("uid");
const Book = require("epubapi");

let cors = require("cors");

Router.use(cors());

port = 3002;
let Books = [];

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

Router.get("/quit", async (req, res) => {
  res.send("cool");
  console.log("its working");
  app.quit();
});

Router.get("/getCover", async (req, res) => {
  const { id } = req.query;

  if (Books != []) {
    for (let i of Books) {
      if (id === i["name"] && i !== undefined) {
        try {
          let bitmap = await fs.readFileSync(i["cover"]);
          res.json({
            img: new Buffer(bitmap).toString("base64"),
          });
        } catch (error) {
          res.json({
            img: "error",
          });
        }
      }
    }
  }
});

Router.get("/home", async (req, res) => {
  const { page } = req.query;
  let pth = "C:\\Users\\Vikleo\\Documents\\books";
  let des = "C:\\Users\\Vikleo\\Desktop\\books";
  let files = await fs.readdirSync(des);
  let Cover = [];

  if (files.length > 0) {
    for (let i of files) {
      let book = await fs.readdirSync(des + "\\" + i);
      let fld = false;
      for (let b = 0; b < book.length; b++) {
        let know = await fs.lstatSync(des + "\\" + i + "\\" + book[b]);

        if (book[b].includes(".opf")) {
          let rd = await fs.readFileSync(
            des + "\\" + i + "\\" + book[b],
            "utf8"
          );
          const $ = cheerio.load(rd);
          const navContent = $("meta");
          let coverImg = "";
          for (let q of navContent) {
            for (let n of q.attributes) {
              if (n["value"] === "cover" && n["name"] === "name") {
                for (let p of q.attributes) {
                  if (p["name"] === "content") {
                    let y = $("#" + p["value"]);
                    let ref = y.attr("href");
                    if (ref === undefined) {
                      y = $("#CoverImage");
                      ref = y.attr("href");
                    }
                    console.log(des.replaceAll("\\", "/"));
                    Cover.push({
                      name: i,
                      cover: des.replaceAll("\\", "/") + "/" + i + "/" + ref,
                      id: uid(),
                    });
                  }
                }
              }
            }
          }
        } else {
          let o = await know.isDirectory();

          if (o) {
            let k = await fs.readdirSync(des + "\\" + i + "\\" + book[b]);
            for (let s of k) {
              if (s.includes(".opf")) {
                let rd = await fs.readFileSync(
                  des + "\\" + i + "\\" + book[b] + "\\" + s,
                  "utf8"
                );

                const $ = cheerio.load(rd);
                const navContent = $("meta");
                let coverImg = "";
                for (let q of navContent) {
                  for (let n of q.attributes) {
                    if (n["value"] === "cover" && n["name"] === "name") {
                      for (let p of q.attributes) {
                        if (p["name"] === "content") {
                          let y = $("item");
                          for (let n of y) {
                            let e = n.attribs["id"];
                            let v = n.attribs["href"];
                            if (e === p["value"]) {
                              ref = v;
                            }
                          }

                          // let ref = y.attr("href");

                          if (ref === undefined) {
                            ref = y.attr("src");
                          }
                          let loc =
                            des.replaceAll("\\", "/") +
                            "/" +
                            i +
                            "/" +
                            book[b] +
                            "/" +
                            ref;
                          if (ref === undefined) {
                            try {
                              console.log("ohh yeahh came here");
                              y = $("#CoverImage");
                              ref = y.attr("href");
                              const buffer = await fs.readFileSync(
                                des + "\\" + i + "\\" + book[b] + "\\" + ref
                              );
                              let k = cheerio.load(buffer);
                              ref = k("img");
                              ref = ref.attr("src");
                              if (ref.includes("..")) {
                                ref = ref.replaceAll("..", "");
                                loc =
                                  des.replaceAll("\\", "/") +
                                  "/" +
                                  i +
                                  "/" +
                                  book[b] +
                                  ref;
                              }
                            } catch (error) {}
                          }
                          console.log(des.replaceAll("\\", "/"));
                          Cover.push({
                            name: i,
                            cover: loc,
                            id: uid(),
                          });
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }

        if (book[b].includes(".ncx")) {
          let ncx = await fs.readFileSync(
            des + "\\" + i + "\\" + book[b],
            "utf8"
          );
          const $ = cheerio.load(ncx);
          const name = $("docTitle");
          const navContent = $("navMap > navPoint");

          let chaps = [];
          for (let i of navContent) {
            let b = $.load(i);
            b = b("navLabel");
            console.log(b.html());
            chaps.push(b.text());
          }
          console.log(chaps);
        }
      }
    }
  }

  Books = Cover;
  res.json({ info: Books });
});

Router.get("/addFolder/", async (req, res) => {
  const { path } = req.query;
  // res.send(path);

  console.log(path);

  // prettier-ignore
  let dataPath = './Database/Main.json'
  let pth = "C:\\Users\\Vikleo\\Documents\\books";
  let des = "C:\\Users\\Vikleo\\Desktop\\books";
  let files = await fs.readdirSync(pth);
  // let bookDir = await fs.readdirSync(des);
  // let d = await fs.readFileSync(dataPath);
  // console.log(d + "data here");
  // Data = JSON.parse(d);
  // console.log(Data + "data here");

  // if (!Data.hasOwnProperty("Books")) {
  //   console.log("Here in the if ");
  //   Data["Books"] = [];
  // } else {
  //   console.log("bot comeign in here ");
  // }
  // console.log(JSON.stringify(Data));

  let goAhead = false;
  for (let i of files) {
    let book = new Book(pth + "\\" + i, des);
    await book.sayhell();
    await book.init();
  }

  // console.log("sdfsdfadfasdfasdasdf");
  // for (let b of bookDir) {
  //   let book = new Book(pth, des);
  //   let bk = {};

  //   let cover = await book.getCover(b);
  //   let chapters = await book.bookData(b);

  //   console.log(cover, chapters + "here this is ", b);

  //   bk["Name"] = book.Name;
  //   bk["Cover"] = book.Cover;
  //   bk["Chapters"] = book.Chapters;

  //   let chap = Data["Books"];
  //   chap.push(bk);
  //   Data["Books"] = chap;
  // }

  res.send(path);

  // let wrt = await fs.writeFileSync(dataPath, JSON.stringify(Data));
});

Router.get("/allBooks", async (req, res) => {
  const { path } = req.query;

  console.log("in the all books ");

  // prettier-ignore
  let dataPath = './Database/Main.json'
  let dataPathSub = "./Database/Sub.json";
  let pth = "C:\\Users\\Vikleo\\Documents\\books";
  let des = "C:\\Users\\Vikleo\\Desktop\\books";
  let files = await fs.readdirSync(des);

  let d = await fs.readFileSync(dataPath);
  let dSub = await fs.readFileSync(dataPathSub);
  let Data = JSON.parse(d);
  let DataSub = JSON.parse(dSub);
  if (!Data.hasOwnProperty("Books")) {
    console.log("Here in the if ");
    Data["Books"] = [];
  } else {
    console.log("not comeign in here ");
  }
  if (!DataSub.hasOwnProperty("Books")) {
    console.log("Here in the if ");
    DataSub["Books"] = [];
  } else {
    console.log("not comeign in here ");
  }

  let bk = Data["Books"];
  let bkSub = DataSub["Books"];
  for (let i of files) {
    console.log(i, "here i");
    let book = new Book(pth, des);
    await book.getCover(i);
    await book.bookData(i);
    // console.log(book.Cover, book.Chapters);
    let tempTwo = {
      Name: book.Name,
      Cover: book.Cover,
      index: bkSub.length,
    };
    let temp = {
      Name: book.Name,
      Cover: book.Cover,
      Chapters: book.Chapters,
    };
    let dont = true;
    for (let o of bkSub) {
      for (let c in o) {
        if (o[c] === temp.Name) {
          dont = false;
        }
      }
    }
    if (dont) {
      bkSub.push(tempTwo);
      bk.push(temp);
    }
  }
  DataSub["Books"] = bkSub;
  Data["Books"] = bk;
  await fs.writeFileSync(dataPathSub, JSON.stringify(DataSub));
  await fs.writeFileSync(dataPath, JSON.stringify(Data));
  res.send(path);
});

Router.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL("http://localhost:5173/");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
};

// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.whenReady().then(() => {
//   createWindow();

//   app.on("activate", () => {
//     // On macOS it's common to re-create a window in the app when the
//     // dock icon is clicked and there are no other windows open.
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// // Quit when all windows are closed, except on macOS. There, it's common
// // for applications and their menu bar to stay active until the user quits
// // explicitly with Cmd + Q.
// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") app.quit();
// });
