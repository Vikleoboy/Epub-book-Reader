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
        path.join(this.des, k[0]) + ".zip"
      );

      await fs.rmSync(path.join(this.des, k[0]), {
        recursive: true,
        force: true,
      });
      await fs.mkdirSync(path.join(this.des, k[0]));

      await extract(path.join(this.des, k[0]) + ".zip", {
        dir: path.join(this.des, k[0]),
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
      await fs.rmSync(path.join(this.des, k[0]) + ".zip", { force: true });
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
      k = [m];
    }

    // console.log(flds , 'this here is were ')
    let bookFolder = path.join(this.des, k[0]);
    let flds = await fs.readdirSync(bookFolder);
    flds = flds.filter((e) => e !== ".DS_Store");
    // flds.pop();

    let opPresent = flds.filter(isOpf);

    function isOpf(file) {
      return path.basename(file).includes(".opf");
    }

    for (let f of flds) {
      let know = await fs.lstatSync(path.join(this.des, k[0], f)).isDirectory();

      let insideFiles = [];
      if (know) {
        insideFiles = await fs.readdirSync(path.join(bookFolder, f));
        insideFiles = insideFiles.filter((e) => e !== ".DS_Store");
        console.log(insideFiles.filter(isOpf));
      }

      if (
        opPresent.length === 0 &&
        insideFiles.filter(isOpf).length > 0 &&
        know
      ) {
        console.log("in the ops");
        opPresent = false;
        let book = await fs.readdirSync(path.join(this.des, k[0], f));

        for (let i of book) {
          if (i.includes(".opf")) {
            console.log(path.join(this.des, k[0], f, i));
            let rd = await fs.readFileSync(
              path.join(this.des, k[0], f, i),
              "utf8"
            );
            const $ = cheerio.load(rd);

            let navContent = $('meta[name~="cover"]');
            let bookName = $("metadata").find("dc\\:title").text();

            console.log(bookName.length, navContent.length);
            if (navContent.length === 0) {
              console.log("IN HERE");
              navContent = $('opf\\:meta[name~="cover"]');
            }

            if (bookName.length === 0) {
              bookName = $("opf\\:metadata").find("dc\\:title").text();
            }

            this.Name = bookName;
            console.log(bookName + "bkbkb");

            console.log(navContent.attr("name"));

            let nm = navContent.attr("name");
            let cv = navContent.attr("content");

            console.log(cv + "here cv");

            if (nm === "cover") {
              let pic = $(`item[id~="${cv}"]`);

              let url = pic.attr("href");

              console.log(url, " mew");
              let realLink = path.join(this.des, k[0], f) + "\\" + url;
              this.Cover = realLink.replaceAll(/\\/g, "/");
              return url;
            } else if (nm === undefined) {
              let cov = $("#cover").attr("href");
              console.log(cov, "here2");

              if (cov !== undefined) {
                let realLink = path.join(this.des, k[0], f, cov);
                this.Cover = realLink.replaceAll(/\\/g, "/");
              } else {
                this.Cover = "NotFound";
              }
            } else {
              this.Cover = "NotFound";
            }
          }
        }
      } else {
        console.log("DAM ");
      }
    }

    if (opPresent.length > 0) {
      let book = await fs.readdirSync(path.join(this.des, k[0]));

      for (let i of book) {
        if (i.includes(".opf")) {
          let rd = await fs.readFileSync(
            path.join(this.des, k[0]) + "\\" + i,
            "utf8"
          );
          const $ = cheerio.load(rd);
          const navContent = $('meta[name~="cover"]');
          const bookName = $("metadata").find("dc\\:title").text();

          console.log(bookName.length, navContent.length);
          if (navContent.length === 0) {
            console.log("IN HERE");
            navContent = $('opf\\:meta[name~="cover"]');
          }

          if (bookName.length === 0) {
            bookName = $("opf\\:metadata").find("dc\\:title").text();
          }

          this.Name = bookName;

          console.log(navContent.attr("name"), "lol");

          console.log(bookName + "bkbkb");

          console.log(navContent.attr("name"));

          let nm = navContent.attr("name");
          let cv = navContent.attr("content");

          console.log(cv + "here cv");

          if (nm === "cover") {
            let pic = $(`item[id~="${cv}"]`);

            let url = pic.attr("href");

            console.log(url, " mew");
            let realLink = path.join(this.des, k[0]) + "\\" + url;
            this.Cover = realLink.replaceAll(/\\/g, "/");
            return url;
          } else if (nm === undefined) {
            let cov = $("#cover").attr("href");
            if (cov !== undefined) {
              let realLink = path.join(this.des, k[0], cov);
              this.Cover = realLink.replaceAll(/\\/g, "/");
            } else {
              this.Cover = "NotFound";
            }
          } else {
            this.Cover = "NotFound";
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
    let ifExists = await fs.existsSync(path.join(this.des, k[0]));

    if (ifExists) {
      console.log(k);

      let bookFolder = path.join(this.des, k[0]);
      let flds = await fs.readdirSync(bookFolder);
      console.log(flds);
      flds = flds.filter((e) => e !== ".DS_Store");
      let opPresent = flds.filter(isNcx);
      console.log(opPresent, "here");
      function isNcx(file) {
        return file.includes(".ncx");
      }

      //   flds.pop(".DS_Store");
      console.log(flds, "k");
      for (let f of flds) {
        let know = await fs
          .lstatSync(path.join(this.des, k[0], f))
          .isDirectory();
        console.log(know, "know");

        let insideFiles = [];
        if (know) {
          insideFiles = await fs.readdirSync(path.join(bookFolder, f));
          insideFiles.pop(".DS_Store");

          console.log(insideFiles.filter(isNcx), "m", insideFiles);
        }

        if (
          opPresent.length === 0 &&
          insideFiles.filter(isNcx).length > 0 &&
          know
        ) {
          opPresent = false;
          let book = await fs.readdirSync(path.join(this.des, k[0], f));

          for (let i of book) {
            if (i.includes(".ncx")) {
              let rd = await fs.readFileSync(
                path.join(this.des, k[0], f, i),
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
                let realLink = path.join(this.des, k[0], f) + "\\" + link;
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
        } else {
          console.log("something wrong ");
        }
      }
      console.log(opPresent.length, opPresent, "le");
      if (opPresent.length > 0) {
        let book = await fs.readdirSync(path.join(this.des, k[0]));

        for (let i of book) {
          if (i.includes(".ncx")) {
            let fil = path.join(this.des, k[0], i);
            let rd = await fs.readFileSync(fil, "utf8");
            const $ = cheerio.load(rd);
            const navContent = $("navMap navPoint");

            let lessons = [];
            for (let p of navContent) {
              let point = $(p);

              let name = point.find("navLabel").text().replaceAll("  ", "");
              name = name.replaceAll(/\t/g, "");
              name = name.replaceAll(/\n/g, "");
              let link = point.find("content").attr("src");
              let realLink = path.join(this.des, k[0]) + "\\" + link;

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
//   "/Users/pablo/Downloads",
//   "/Users/pablo/Downloads/Epub-book-Reader-EPubJS-Integration/books"
// );

// let bk = new Book(
//   "C:\\Users\\vikle\\Documents\\GitHubProjects\\Epub-book-Reader\\books",
//   "C:\\Users\\vikle\\Documents\\GitHubProjects\\Epub-book-Reader\\books"
// );
// // // // // await bk.init();
// // // Matt Parker - Humble Pi_ A Comedy of Maths Errors-Penguin UK (2019)
// async function somethign() {
//   let n = await bk.getCover(
//     "Matt Parker - Humble Pi_ A Comedy of Maths Errors-Penguin UK (2019)"
//   );
//   await bk.bookData(
//     "Matt Parker - Humble Pi_ A Comedy of Maths Errors-Penguin UK (2019)"
//   );
//   console.log(bk.Name, bk.Cover, " here");
// }

// somethign();

module.exports = Book;
