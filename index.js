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
const { runInContext } = require("vm");

const corsOptions = {
  origin: "http://localhost:3002", // Allow requests from this origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow these HTTP methods
  allowedHeaders: "Content-Type,Authorization", // Allow these headers
};

Router.use(cors(corsOptions));

Router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
port = 3002;

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

Router.get("/quit", async (req, res) => {
  res.send("cool");
  console.log("its working");
  app.quit();
});

Router.get("/getCover", async (req, res) => {
  const { id } = req.query;
  let dataPath = "./Database/Main.json";
  let dataPathSub = "./Database/Sub.json";
  let dSub = await fs.readFileSync(dataPathSub);

  let DataSub = JSON.parse(dSub);
  let Books = DataSub["Books"];
  if (Books != []) {
    for (let i of Books) {
      if (id === i["Name"] && i !== undefined) {
        try {
          let bitmap = await fs.readFileSync(i["Cover"]);
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
  let dataPath = "./Database/Main.json";
  let dataPathSub = "./Database/Sub.json";
  let dSub = await fs.readFileSync(dataPathSub);

  let DataSub = JSON.parse(dSub);

  let Books = [];
  if (DataSub.Books !== undefined) {
    if (DataSub["Books"].length !== 0) {
      for (let i of DataSub["Books"]) {
        i["id"] = uid();
        Books.push(i);
      }
    }
    res.json({ info: Books });
  } else {
    res.json({ inof: "error" });
  }
});

let des = "C:\\Users\\Vikleo\\Desktop\\books";
Router.use(express.static(des));

Router.get("/Read/:id/:ind", async (req, res) => {
  const { id, ind } = req.params;
  console.log(id + " this is id of read ");

  let dataPath = "./Database/Main.json";
  let dataPathSub = "./Database/Sub.json";

  let d = await fs.readFileSync(dataPath);
  let dSub = await fs.readFileSync(dataPathSub);

  let DataSub = JSON.parse(dSub);
  let Data = JSON.parse(d);
  if (DataSub["Books"].length !== 0) {
    for (let i of DataSub["Books"]) {
      if (i["Name"] === id) {
        let les = Data["Books"][i["index"]]["Chapters"][ind];
        let chap = await fs.readFileSync(les.link.split("#")[0]);

        let $ = cheerio.load(chap);

        let head = $("head");
        let link = "http://localhost:3002/" + les.link.replace(i["base"], "");
        console.log(link);
        head.prepend(`<base href= "${link}"  />`);
        // console.log(head.html());
        // console.log(les.link.split("#")[0]);
        res.json(
          JSON.stringify({
            ch: $.html(),
            link: "something",
            base: "somthing",
          })
        );
      }
    }
  }
});

Router.get("/addFolder/", async (req, res) => {
  const { path } = req.query;
  // res.send(path);

  console.log(path);

  // prettier-ignore
  let dataPath = './Database/Main.json'
  let pth = path;
  let des = "C:\\Users\\Vikleo\\Desktop\\books";

  try {
    await fs.statSync(pth).isDirectory(); // if directory does not exist
    res.json({ res: "Done" });
  } catch (error) {
    //else
    res.json({ res: "NVP", error: error }); // sending not valid path
    return;
  }

  let files = await fs.readdirSync(pth);

  let goAhead = false;
  for (let i of files) {
    let book = new Book(pth + "\\" + i, des);
    await book.sayhell();
    await book.init();
  }

  res.send(path);

  // let wrt = await fs.writeFileSync(dataPath, JSON.stringify(Data));
});

Router.get("/allBooks", async (req, res) => {
  const { path } = req.query;

  console.log("in the all books ");

  // prettier-ignore
  let dataPath = './Database/Main.json'
  let dataPathSub = "./Database/Sub.json";
  let pth = path;
  let des = "C:\\Users\\Vikleo\\Desktop\\books";

  try {
    await fs.statSync(pth).isDirectory(); // if directory does not exist
  } catch (error) {
    //else
    res.json({ res: "NVP", error: error }); // sending not valid path
    return;
  }
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
      base: des.replace(/\\/g, "/"),
    };
    let temp = {
      Name: book.Name,
      Cover: book.Cover,
      Chapters: book.Chapters,
      base: des.replace(/\\/g, "/"),
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
  res.json({ res: "Done" });
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
