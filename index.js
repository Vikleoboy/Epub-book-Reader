// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("path");
const express = require("express");
const fs = require("fs");

const Router = express();

const cheerio = require("cheerio");
const { uid } = require("uid");
const Book = require("./book.js");
const unzipper = require("unzipper");
//add new comment
let cors = require("cors");
const { default: axios } = require("axios");
const { execSync } = require("child_process");
const { v4: uuidv4 } = require('uuid');
let mainDes = __dirname + "\\books";

// const corsOptions = {
//   origin: "http://localhost:3002", // Allow requests from this origin
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow these HTTP methods
//   allowedHeaders: "Content-Type,Authorization", // Allow these headers
// };

Router.use(cors());
Router.use(express.json());

Router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
port = 3002;

let t = async () => {
  let y = await fs.existsSync("./Database");
  if (!y) {
    await fs.mkdirSync("./Database");
    await fs.writeFileSync("./Database/Main.json", "{}");
    await fs.writeFileSync("./Database/Sub.json", "{}");
  }

  let n = await fs.existsSync("./books");
  if (!n) {
    await fs.mkdirSync("./books");
  }

  //add .epub EpubBooks Folder in the project database directory
  let epubFol = await fs.existsSync("./EpubBooks");
  if (!epubFol) {
    await fs.mkdirSync("./EpubBooks");
  }
};

t();

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

Router.get("/quit", async (req, res) => {
  res.send("cool");
  console.log("its working");
  app.quit();
});

Router.get("/getTags", async (req, res) => {
  const { tagName } = req.query;
  // acessing the databse

  console.log("Came in getTags Function");
  let dataPath = "./Database/Main.json";
  let dataPathSub = "./Database/Sub.json";

  let d = await fs.readFileSync(dataPath);
  let dSub = await fs.readFileSync(dataPathSub);
  let Data = JSON.parse(d);
  let DataSub = JSON.parse(dSub);

  //checking if Books and other perameters are there in the databse if not adding them

  // checks if it has base proerty
  if (!Data.hasOwnProperty("Tags")) {
    console.log("Here in the if ");
    Data["Tags"] = [];
  } else {
    console.log("not comeign in here ");
  }
  if (!DataSub.hasOwnProperty("Tags")) {
    console.log("Here in the if ");
    DataSub["Tags"] = [];
  } else {
    console.log("not comeign in here ");
  }

  // checks if it has base proerty
  if (!Data.hasOwnProperty("Base")) {
    console.log("Here in the if ");
    Data["Base"] = mainDes.replace(/\\/g, "/");
  } else {
    console.log("not comeign in here ");
  }
  if (!DataSub.hasOwnProperty("Base")) {
    console.log("Here in the if ");
    DataSub["Base"] = mainDes.replace(/\\/g, "/");
  } else {
    console.log("not comeign in here ");
  }

  // checks if has Books property
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

  res.json({ Tags: DataSub["Tags"] });
});

Router.get("/addTag", async (req, res) => {
  const { tagName } = req.query;
  // acessing the databse
  let dataPath = "./Database/Main.json";
  let dataPathSub = "./Database/Sub.json";

  let d = await fs.readFileSync(dataPath);
  let dSub = await fs.readFileSync(dataPathSub);
  let Data = JSON.parse(d);
  let DataSub = JSON.parse(dSub);

  //checking if Books and other perameters are there in the databse if not adding them

  // checks if it has base proerty
  if (!Data.hasOwnProperty("Tags")) {
    console.log("Here in the if ");
    Data["Tags"] = [];
  } else {
    console.log("not comeign in here ");
  }
  if (!DataSub.hasOwnProperty("Tags")) {
    console.log("Here in the if ");
    DataSub["Tags"] = [];
  } else {
    console.log("not comeign in here ");
  }

  // checks if it has base proerty
  if (!Data.hasOwnProperty("Base")) {
    console.log("Here in the if ");
    Data["Base"] = mainDes.replace(/\\/g, "/");
  } else {
    console.log("not comeign in here ");
  }
  if (!DataSub.hasOwnProperty("Base")) {
    console.log("Here in the if ");
    DataSub["Base"] = mainDes.replace(/\\/g, "/");
  } else {
    console.log("not comeign in here ");
  }

  // checks if has Books property
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

  console.log(DataSub["Tags"], DataSub["Tags"].indexOf(tagName));
  if (DataSub["Tags"].indexOf(tagName) < 0 && tagName !== undefined) {
    let dataTag = Data["Tags"];
    let dataSubTag = DataSub["Tags"];
    dataTag.push(tagName);
    dataSubTag.push(tagName);

    Data["Tags"] = dataTag;
    DataSub["Tags"] = dataSubTag;
    await fs.writeFileSync(dataPathSub, JSON.stringify(DataSub));
    await fs.writeFileSync(dataPath, JSON.stringify(Data));
    res.json({ res: "Done" });
  } else {
    console.log("ALREDY EXISTS TAG");
    res.json({ res: "NVP" });
  }
});

Router.get("/delTag", async (req, res) => {
  const { tagName } = req.query;
  // acessing the databse
  let dataPath = "./Database/Main.json";
  let dataPathSub = "./Database/Sub.json";

  let d = await fs.readFileSync(dataPath);
  let dSub = await fs.readFileSync(dataPathSub);
  let Data = JSON.parse(d);
  let DataSub = JSON.parse(dSub);
  let ifsend = true;
  //checking if Books and other perameters are there in the databse if not adding them

  // checks if it has base proerty
  if (!Data.hasOwnProperty("Tags")) {
    console.log("Here in the if ");
    Data["Tags"] = [];
  } else {
    console.log("not comeign in here ");
  }
  if (!DataSub.hasOwnProperty("Tags")) {
    console.log("Here in the if ");
    DataSub["Tags"] = [];
  } else {
    console.log("not comeign in here ");
  }

  // checks if it has base proerty
  if (!Data.hasOwnProperty("Base")) {
    console.log("Here in the if ");
    Data["Base"] = mainDes.replace(/\\/g, "/");
  } else {
    console.log("not comeign in here ");
  }
  if (!DataSub.hasOwnProperty("Base")) {
    console.log("Here in the if ");
    DataSub["Base"] = mainDes.replace(/\\/g, "/");
  } else {
    console.log("not comeign in here ");
  }

  // checks if has Books property
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

  let index = DataSub["Tags"].indexOf(tagName);

  Data["Tags"].splice(index, 1);
  DataSub["Tags"].splice(index, 1);

  let Books = DataSub["Books"];
  if (Books != []) {
    for (let i of Books) {
      if (!i.hasOwnProperty("Tags")) {
        i["Tags"] = [];
        let ind = DataSub["Books"].indexOf(i);

        Data["Books"][ind]["Tags"] = [];
      }
      if (i["Tags"]?.includes(tagName)) {
        if (i["Tags"].indexOf(tagName) >= 0 && tagName !== undefined) {
          let index = i["Tags"].indexOf(tagName);
          let ind = DataSub["Books"].indexOf(i);
          i["Tags"].splice(index, 1);
          Data["Books"][ind]["Tags"].splice(index, 1);

          ifsend = false;
        }
      }
    }
  }

  await fs.writeFileSync(dataPathSub, JSON.stringify(DataSub));
  await fs.writeFileSync(dataPath, JSON.stringify(Data));

  console.log(DataSub["Tags"]);
  if (!ifsend) {
    res.json({ res: "Done" });
  } else {
    res.json({ res: "NotFound" });
  }
});

// const isEPubFileExists = (ePubFileData) => {
//   let ePubBooksRec = ePubFileData["EPubBooks"];

// }

// Function to generate and ensure unique UUID
function generateAndEnsureUniqueUuid() {
  let uuid;
  do {
    uuid = uuidv4();
  } while (data.items.hasOwnProperty(uuid));
  return uuid;
}

const addEpubBooks = async (ePubFilePath) =>{
  console.log("Unde addEpubBooks function")
  console.log("Path of file is : "+ePubFilePath) 
  // if (!ePubFileData.hasOwnProperty("EPubBooks")) {
  //   console.log("Creating the EPubBooks tag in ePubBooks Json file");
  //   ePubFileData["EPubBooks"] = [];
  // } else {
  //   console.log("not comeign in here ");
  // }

  // loop over existing epub files
  // Add only if does not exists 
  //try{
    // const fileName = path.basename(ePubFilePath);
    // const isFile = await fs.access(ePubFilePath).then(() => true).catch(() => false);

  // Read file name from the provided path
  const fileName = generateAndEnsureUniqueUuid() + path.basename(ePubFilePath);

  // Ensure the destination directory exists
  const destDir = './Database/EpubBooks';
  // Construct new file path with .epub extension
  const newFilePath = path.join(destDir, `${fileName}`);

  // Move the file to destination directory
  fs.copyFileSync(ePubFilePath, newFilePath);
    }
  // }catch(){

  // }

Router.post("/addBook", async (req, res) => {
  console.log("in here ");

  let p = req.body["pm"];
  console.log(p);

  
  // acessing the databse
  let dataPath = "./Database/Main.json";
  let dataPathSub = "./Database/Sub.json";

  let d = await fs.readFileSync(dataPath);
  let dSub = await fs.readFileSync(dataPathSub);
  let Data = JSON.parse(d);
  let DataSub = JSON.parse(dSub);

  //checking if Books and other perameters are there in the databse if not adding them

  // checks if it has base proerty
  if (!Data.hasOwnProperty("Tags")) {
    console.log("Here in the if ");
    Data["Tags"] = [];
  } else {
    console.log("not comeign in here ");
  }
  if (!DataSub.hasOwnProperty("Tags")) {
    console.log("Here in the if ");
    DataSub["Tags"] = [];
  } else {
    console.log("not comeign in here ");
  }

  // checks if it has base proerty
  if (!Data.hasOwnProperty("Base")) {
    console.log("Here in the if ");
    Data["Base"] = mainDes.replace(/\\/g, "/");
  } else {
    console.log("not comeign in here ");
  }
  if (!DataSub.hasOwnProperty("Base")) {
    console.log("Here in the if ");
    DataSub["Base"] = mainDes.replace(/\\/g, "/");
  } else {
    console.log("not comeign in here ");
  }

  // checks if has Books property
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

  // checking if the valid path
  let pth = p.replace(/"/g, "");
  console.log(pth, p, "this is here ");
  let fld = fs.existsSync(pth);
  var send = false;
  if (!fld) {
    res.json({ res: "NVP" });
    return;
  } else {
    send = true;
  }

  // logic for add the book in the destination and Databse
  try {
    // initialise book

    let book = new Book(pth, mainDes);

    // dummy variables
    let bk = Data["Books"];
    let bkSub = DataSub["Books"];

    // reading the book Data
    let n = path.basename(pth);
    n = n.replace(".epub", "");

    console.log(n);

    // you want write code to copy the file 
    //use uid to give uniqe name to the books 
    // mpub , asdfasdd.epub

    

    await addEpubBooks(pth);
    let results = await execSync(`python ./addBook.py  "${pth}" "${mainDes}"`); //extracts the file 

    await book.getCover(n);
    await book.bookData(n);
    // console.log(book.Cover, book.Chapters);

    // templets for adding the book for each databse
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

    // cheking if the book alredy exists in the databse
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

    // writeing the book to the databse
    DataSub["Books"] = bkSub;
    Data["Books"] = bk;
    await fs.writeFileSync(dataPathSub, JSON.stringify(DataSub));
    await fs.writeFileSync(dataPath, JSON.stringify(Data));

    // ending the programm with response
    res.json({ res: "Done" });
  } catch (error) {
    console.log(error);
    res.json({ res: "Done" });
  }
});

Router.post("/delBookTag", async (req, res) => {
  let Name = req.body["Name"];
  let Tag = req.body["Tag"];

  let dataPath = "./Database/Main.json";
  let dataPathSub = "./Database/Sub.json";
  let dSub = await fs.readFileSync(dataPathSub);
  let d = await fs.readFileSync(dataPath);

  let DataSub = JSON.parse(dSub);
  let Data = JSON.parse(d);
  let Books = DataSub["Books"];
  if (Books != []) {
    for (let i of Books) {
      if (Name === i["Name"] && i !== undefined) {
        if (!i.hasOwnProperty("Tags")) {
          i["Tags"] = [];
          let ind = DataSub["Books"].indexOf(i);

          Data["Books"][ind]["Tags"] = [];
        }
        if (i["Tags"].indexOf(Tag) >= 0 && Tag !== undefined) {
          let index = i["Tags"].indexOf(Tag);
          let ind = DataSub["Books"].indexOf(i);
          i["Tags"].splice(index, 1);
          Data["Books"][ind]["Tags"].splice(index, 1);
          await fs.writeFileSync(dataPathSub, JSON.stringify(DataSub));
          await fs.writeFileSync(dataPath, JSON.stringify(Data));
          res.json({ res: "Done" });
        }
      }
    }
  }
  res.json({ res: "NotFound" });
});

Router.post("/addBookTag", async (req, res) => {
  let Name = req.body["Name"];
  let Tag = req.body["Tag"];
  let ifsend = true;
  let dataPath = "./Database/Main.json";
  let dataPathSub = "./Database/Sub.json";
  let dSub = await fs.readFileSync(dataPathSub);
  let d = await fs.readFileSync(dataPath);

  let DataSub = JSON.parse(dSub);
  let Data = JSON.parse(d);
  let Books = DataSub["Books"];
  if (Books != []) {
    for (let i of Books) {
      if (Name === i["Name"] && i !== undefined) {
        if (!i.hasOwnProperty("Tags")) {
          i["Tags"] = [];
          let ind = DataSub["Books"].indexOf(i);
          Data["Books"][ind]["Tags"] = [];
        }
        if (i["Tags"].indexOf(Tag) < 0 && Tag !== undefined) {
          let index = i["Tags"].indexOf(Tag);
          let ind = DataSub["Books"].indexOf(i);
          i["Tags"].push(Tag);
          Data["Books"][ind]["Tags"].push(Tag);
          await fs.writeFileSync(dataPathSub, JSON.stringify(DataSub));
          await fs.writeFileSync(dataPath, JSON.stringify(Data));
          ifsend = false;
        }
      }
    }
  }

  if (ifsend) {
    res.json({ res: "NotFound" });
  }
});

Router.get("/getBookTags", async (req, res) => {
  const { tagName: Name } = req.query;
  let ifsend = true;
  let dataPath = "./Database/Main.json";
  let dataPathSub = "./Database/Sub.json";
  let dSub = await fs.readFileSync(dataPathSub);
  let d = await fs.readFileSync(dataPath);

  let DataSub = JSON.parse(dSub);
  let Data = JSON.parse(d);
  let Books = DataSub["Books"];
  if (Books != []) {
    for (let i of Books) {
      if (Name === i["Name"] && i !== undefined) {
        if (!i.hasOwnProperty("Tags")) {
          i["Tags"] = [];
          let ind = DataSub["Books"].indexOf(i);
          Data["Books"][ind]["Tags"] = [];
        }
        ifsend = false;
        res.json({ Tags: i["Tags"] });
      }
    }
  }
  if (ifsend) {
    res.json({ res: "NotFound" });
  }
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
  const { Tag } = req.query;
  let dataPath = "./Database/Main.json";
  let dataPathSub = "./Database/Sub.json";
  let dSub = await fs.readFileSync(dataPathSub);

  let DataSub = JSON.parse(dSub);
  console.log(Tag);
  let checkName = (bk) => {
    if (bk["Tags"] !== undefined) {
      return bk["Tags"].includes(Tag);
    }
  };
  if (Tag !== undefined) {
    console.log("For noo reason", Tag, DataSub["Books"].filter(checkName));
    DataSub["Books"] = DataSub["Books"].filter(checkName);
  }
  // let Books = [];
  // for (i of DataSub.Books) {
  //   Books.push(i.Name);
  // }
  if (DataSub.Books !== undefined) {
    res.json({ info: DataSub.Books });
  } else {
    res.json({ inof: "error" });
  }
});

let des = mainDes;
Router.use(express.static(des));
Router.use(express.static('./epub'));


Router.get("/Read", async (req, res) => {
  const { id } = req.query;
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
        console.log(i['FolderName'])
        
        res.json(
          {
            url : `http://localhost:3002/${i['FolderName']}.epub`
          }
        );
      }
    }
  }
});

Router.get("/delBook", async (req, res) => {
  const { id } = req.query;
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
        let index = DataSub["Books"].indexOf(i);

        if (index > -1) {
          // only splice array when item is found
          DataSub["Books"].splice(index, 1); // 2nd parameter means remove one item only
          Data["Books"].splice(index, 1);
        }

        await fs.writeFileSync(dataPathSub, JSON.stringify(DataSub));
        await fs.writeFileSync(dataPath, JSON.stringify(Data));
        res.json({ res: "Done" });
      }
    }
  }
});

Router.get("/addFolder/", async (req, res) => {
  const { path: p } = req.query;
  // res.send(path);
  id = uid() //file name 
  let ifsend = true
  let fld = fs.existsSync(p);
  let send = false;
  if (!fld) {
    ifsend = false ;
    res.json({ res: "NVP" });
    return;
  }

  console.log(path);

  let dataPath = "./Database/Main.json";
  let dataPathSub = "./Database/Sub.json";
  let pth = p;
  let des = mainDes;

  // for over des folder files and if they are epub files then copy them into epub folder 


  try {
    // Read the directory to get all EPUB files
    // let realPath = pth.replace(/\\/g, "/");
    // let realDes = des.replace(/\\/g, "/") + "/";
    console.log(pth);
    console.log(pth.replace(/\\/g, "/"), des.replace(/\\/g, "/") + "/");
    let results = await execSync(`python ./addFolder.py  "${pth}" "${des}"`);
    console.log(results);
  } catch (error) {
    console.error("Error reading directory:", error);
  } 


  // variablespraseing data 
  let d = await fs.readFileSync(dataPath);
  let dSub = await fs.readFileSync(dataPathSub);
  let Data = JSON.parse(d);
  let DataSub = JSON.parse(dSub);
  let files = await fs.readdirSync(des);

  
  // Adding the Books and other properties if its alredy not there in the files
  // checks if it has base proerty
  if (!Data.hasOwnProperty("Tags")) {
    console.log("Here in the if ");
    Data["Tags"] = [];
  } else {
    console.log("not comeign in here ");
  }
  if (!DataSub.hasOwnProperty("Tags")) {
    console.log("Here in the if ");
    DataSub["Tags"] = [];
  } else {
    console.log("not comeign in here ");
  }

  // checks if it has base proerty
  if (!Data.hasOwnProperty("Base")) {
    console.log("Here in the if ");
    Data["Base"] = mainDes.replace(/\\/g, "/");
  } else {
    console.log("not comeign in here ");
  }
  if (!DataSub.hasOwnProperty("Base")) {
    console.log("Here in the if ");
    DataSub["Base"] = mainDes.replace(/\\/g, "/");
  } else {
    console.log("not comeign in here ");
  }

  // checks if has Books property
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
  
  try { 

    let bk = Data["Books"];
  let bkSub = DataSub["Books"];
  for (let i of files) {
    console.log(i, "here i");
    let book = new Book(pth, des);
    await book.getCover(i);
    await book.bookData(i);
    // console.log(book.Cover, book.Chapters);

    
    let tempTwo = {
      id : id,
      Name: book.Name,
      Cover: book.Cover,
      FolderName : i.replace('.epub', '')
    };
    let temp = {
      id : id ,
      Name: book.Name,
      Cover: book.Cover,
      FolderName :  i.replace('.epub', ''),
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

  }catch(error){
    console.log('error here ' , error)
  }finally {
    if(ifsend){
      res.json({ res: "Done" });
    }
  }

  // let wrt = await fs.writeFileSync(dataPath, JSON.stringify(Data));
});

Router.get("/allBooks", async (req, res) => {
  const { path: pathToDes } = req.query;

  console.log("I HAV ENO I DEA WHATS HAPPENING ");

  console.log("in the all books ");

  let dataPath = "./Database/Main.json";
  let dataPathSub = "./Database/Sub.json";
  
  let des = mainDes;

  let files = await fs.readdirSync(des);

  let d = await fs.readFileSync(dataPath);
  let dSub = await fs.readFileSync(dataPathSub);
  let Data = JSON.parse(d);
  let DataSub = JSON.parse(dSub);

  // Adding the Books and other properties if its alredy not there in the files
  // checks if it has base proerty
  if (!Data.hasOwnProperty("Tags")) {
    console.log("Here in the if ");
    Data["Tags"] = [];
  } else {
    console.log("not comeign in here ");
  }
  if (!DataSub.hasOwnProperty("Tags")) {
    console.log("Here in the if ");
    DataSub["Tags"] = [];
  } else {
    console.log("not comeign in here ");
  }

  // checks if it has base proerty
  if (!Data.hasOwnProperty("Base")) {
    console.log("Here in the if ");
    Data["Base"] = mainDes.replace(/\\/g, "/");
  } else {
    console.log("not comeign in here ");
  }
  if (!DataSub.hasOwnProperty("Base")) {
    console.log("Here in the if ");
    DataSub["Base"] = mainDes.replace(/\\/g, "/");
  } else {
    console.log("not comeign in here ");
  }

  // checks if has Books property
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
      FolderName : i.replace('.epub', '')
    };
    let temp = {
      Name: book.Name,
      Cover: book.Cover,
      FolderName :  i.replace('.epub', ''),
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
  res.send(pathToDes);
});

Router.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1400,
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

// app.whenReady().then(() => {
//   createWindow();

//   app.on("activate", () => {
//     // On macOS it's common to re-create a window in the app when the
//     // dock icon is clicked and there are no other windows open.
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") app.quit();
// });
