const path = require("path");
const fs = require("fs");

const cheerio = require("cheerio");

const extract = require("extract-zip");

class Book {
  pth;
  des;
  Book;
  byZip;
  Cover;
  Name;
  Chapters;

  constructor(p, d, Zip = false) {
    this.pth = p;
    this.des = d;
    console.log(Zip);
    if (Zip) {
      this.byZip = true;
    } else {
      this.byZip = false;
    }
  }

  async sayhell() {
    console.log("HELLL NOOO  ");
  }

  async init() {
    let fileName = path.basename(this.pth);
    let isFile = await fs.existsSync(this.pth);

    console.log(fileName, isFile);
    if (fileName.includes(".epub") && isFile) {
      let k = fileName.split(".");
      k.pop();
      console.log(k);
      let m = k.join(".");
      k = [m];
      let copyfile = await fs.copyFileSync(
        this.pth,
        path.join(this.des , k[0]) + ".zip"
      );

      await fs.rmSync(path.join(this.des , k[0]), { recursive: true, force: true });
      await fs.mkdirSync(path.join(this.des , k[0]));

      await extract(path.join(this.des , k[0]) + ".zip", {
        dir: path.join(this.des , k[0]),
      });

      // try {
      //   await fs
      //     .createReadStream(path.join(this.des , k[0]) + ".zip")
      //     .pipe(unzipper.Extract({ path: path.join(this.des , k[0]) }))
      //     .promise();
      //   console.log("Extraction complete");
      // } catch (error) {
      //   console.error("Error during extraction:", error);
      // }
      await fs.rmSync(path.join(this.des , k[0]) + ".zip", { force: true });
      return 1;
    } else {
      console.log("not an epubfile");
      return 0;
    }
  }

  async getCover(fld) {
    let fileName = path.basename(this.pth);
    let k;
    if (fld !== undefined) {
      k = [fld];
    } else {
      k = fileName.split(".");
      k.pop();
      let m = k.join(".");
      k = [m];``
    }

    // console.log(flds , 'this here is were ')

    let flds = await fs.readdirSync(path.join(this.des, k[0]));
    flds.pop('.DS_Store')


    let opPresent = true;

    for (let f of flds) {
      let know = await fs
        .lstatSync(path.join(this.des ,k[0] ,f))
        .isDirectory();

      if (f.includes("O") || (f.includes("o") && know)) {
        console.log("in the ops");
        opPresent = false;
        let book = await fs.readdirSync(path.join(this.des ,k[0] ,f));

        for (let i of book) {
          if (i.includes(".opf")) {
            console.log(path.join(this.des ,k[0] ,f,i) );
            let rd = await fs.readFileSync(
              path.join(this.des ,k[0] ,f,i),
              "utf8"
            );
            const $ = cheerio.load(rd);

            let navContent = $('meta[name~="cover"]');
            let bookName = $("metadata").find("dc\\:title").text();

            if (navContent.length === 0 || bookName.length === 0) {
              console.log("IN HERE");
              navContent = $('opf\\:meta[name~="cover"]');
              bookName = $("opf\\:metadata").find("dc\\:title").text();
            }
            console.log(bookName + "bkbkb");

            this.Name = bookName;
            console.log(navContent.attr("name"));

            let nm = navContent.attr("name");
            let cv = navContent.attr("content");

            console.log(cv + "here cv");

            if (nm === "cover") {
              let pic = $(`item[id~="${cv}"]`);

              let url = pic.attr("href");

              console.log(url);
              let realLink = path.join(this.des ,k[0] ,f) + "\\" + url;
              this.Cover = realLink.replaceAll(/\\/g, "/");
              return url;
            }
          }
        }
      }
    }

    if (opPresent) {
      let book = await fs.readdirSync(path.join(this.des , k[0]));

      for (let i of book) {
        if (i.includes(".opf")) {
          let rd = await fs.readFileSync(
            path.join(this.des , k[0]) + "\\" + i,
            "utf8"
          );
          const $ = cheerio.load(rd);
          const navContent = $('meta[name~="cover"]');
          const bookName = $("metadata").find("dc\\:title").text();

          this.Name = bookName;

          console.log(navContent.attr("name"));

          let nm = navContent.attr("name");
          let cv = navContent.attr("content");

          if (navContent.length === 0 || bookName.length === 0) {
            console.log("IN HERE");
            navContent = $('opf\\:meta[name~="cover"]');
            bookName = $("opf\\:metadata").find("dc\\:title").text();
          }

          if (nm === "cover") {
            let pic = $(`item[id~="${cv}"]`);

            let url = pic.attr("href");

            let realLink = path.join(this.des , k[0]) + "\\" + url;
            this.Cover = realLink.replaceAll(/\\/g, "/");
            return url;
          }
        }
      }
    }
  }
  async bookData(fld) {
    let fileName = path.basename(this.pth);
    let k;
    if (fld !== undefined) {
      k = [fld];
    } else {
      k = fileName.split(".");
      k.pop();
      let m = k.join(".");
      k = [m];
    }
    let ifExists = await fs.existsSync(path.join(this.des , k[0]));

    if (ifExists) {
      console.log(k);

      let flds = await fs.readdirSync(path.join(this.des , k[0]));
      flds.pop('.DS_Store')

      let opPresent = true;

      for (let f of flds) {
        let know = await fs
          .lstatSync(path.join(this.des ,k[0] ,f))
          .isDirectory();

        if (f.includes("O") || (f.includes("o") && know)) {
          opPresent = false;
          let book = await fs.readdirSync(path.join(this.des ,k[0] ,f));

          for (let i of book) {
            if (i.includes(".ncx")) {
              let rd = await fs.readFileSync(
                path.join(this.des ,k[0] ,f,i),
                "utf8"
              );
              const $ = cheerio.load(rd);
              const navContent = $("navMap navPoint");

              let lessons = [];
              for (let p of navContent) {
                let point = $(p);

                let name = point.find("navLabel").text().replaceAll("  ", "");
                name = name.replaceAll(/\t/g, "");
                name = name.replaceAll(/\n/g, "");
                let link = point.find("content").attr("src");
                let realLink = path.join(this.des ,k[0] ,f) + "\\" + link;
                lessons.push({
                  name: name,
                  link: realLink.replaceAll(/\\/g, "/"),
                });
              }

              this.Chapters = lessons;
              return {
                Chapters: lessons,
              };
            }
          }
        }
      }

      if (opPresent) {
        let book = await fs.readdirSync(path.join(this.des , k[0]));

        for (let i of book) {
          if (i.includes(".ncx")) {
            let rd = await fs.readFileSync(
              path.join(this.des , k[0]) + "\\" + "\\" + i,
              "utf8"
            );
            const $ = cheerio.load(rd);
            const navContent = $("navMap navPoint");

            let lessons = [];
            for (let p of navContent) {
              let point = $(p);

              let name = point.find("navLabel").text().replaceAll("  ", "");
              name = name.replaceAll(/\t/g, "");
              name = name.replaceAll(/\n/g, "");
              let link = point.find("content").attr("src");
              let realLink = path.join(this.des , k[0]) + "\\" + link;

              lessons.push({
                name: name,
                link: realLink.replaceAll(/\\/g, "/"),
              });
            }

            this.Chapters = lessons;
            return {
              Chapters: lessons,
            };
          }
        }
      }
    }
  }

  saythings() {
    console.log(this.pth, this.des);
  }
}

// let bk = new Book(
//   "C:/Users/Vikleo/Desktop/Steve.epub",
//   "C:/Users/Vikleo/Desktop/bk"
// );

// let bk = new Book(
//   "C:\\Users\\Vikleo\\Desktop\\brianna-wiest-the-mountain-is-you-thought-catalog-books-2021.epub",
//   "C:\\Users\\Vikleo\\Desktop\\bk"
// );
// // // await bk.init();
// async function somethign() {
//   let y = await bk.init();

//   let n = await bk.getCover("Steve");
//   await bk.bookData("Steve");
//   console.log(bk.Name, bk.Cover, " here", y);
// }

// somethign();
// await bk.bookData("book");

module.exports = Book;
