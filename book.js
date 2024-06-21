const path = require("path");
const fs = require("fs").promises;
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
    console.log("HELLL ");
  }

  async init() {
    const fileName = path.basename(this.pth);
    const isFile = await fs.access(this.pth).then(() => true).catch(() => false);

    console.log(fileName, isFile);
    if (fileName.includes(".epub") && isFile) {
      const k = fileName.split(".");
      k.pop();
      const m = k.join(".");
      const destZip = path.join(this.des, `${m}.zip`);

      await fs.copyFile(this.pth, destZip);

      const destFolder = path.join(this.des, m);
      await fs.rm(destFolder, { recursive: true, force: true });
      await fs.mkdir(destFolder);

      await extract(destZip, { dir: destFolder });
      await fs.rm(destZip, { force: true });
      return 1;
    } else {
      console.log("not an epubfile");
      return 0;
    }
  }

  async getCover(fld) {
    const fileName = path.basename(this.pth);
    let k;
    if (fld !== undefined) {
      k = [fld];
    } else {
      k = fileName.split(".");
      k.pop();
      const m = k.join(".");
      k = [m];
    }

    const folderPath = path.join(this.des, k[0]);
    const flds = await fs.readdir(folderPath);

    let opPresent = true;

    for (const f of flds) {
      const subFolderPath = path.join(folderPath, f);
      const isDirectory = (await fs.lstat(subFolderPath)).isDirectory();

      if ((f.includes("O") || f.includes("o")) && isDirectory) {
        console.log("in the ops");
        opPresent = false;
        const bookFiles = await fs.readdir(subFolderPath);

        for (const i of bookFiles) {
          if (i.includes(".opf")) {
            const opfFilePath = path.join(subFolderPath, i);
            const rd = await fs.readFile(opfFilePath, "utf8");
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

            const nm = navContent.attr("name");
            const cv = navContent.attr("content");

            console.log(cv + "here cv");

            if (nm === "cover") {
              const pic = $(`item[id~="${cv}"]`);
              const url = pic.attr("href");
              const realLink = path.join(subFolderPath, url);
              this.Cover = realLink;
              return url;
            }
          }
        }
      }
    }

    if (opPresent) {
      const bookFiles = await fs.readdir(folderPath);

      for (const i of bookFiles) {
        if (i.includes(".opf")) {
          const opfFilePath = path.join(folderPath, i);
          const rd = await fs.readFile(opfFilePath, "utf8");
          const $ = cheerio.load(rd);
          let navContent = $('meta[name~="cover"]');
          let bookName = $("metadata").find("dc\\:title").text();

          if (navContent.length === 0 || bookName.length === 0) {
            console.log("IN HERE");
            navContent = $('opf\\:meta[name~="cover"]');
            bookName = $("opf\\:metadata").find("dc\\:title").text();
          }

          this.Name = bookName;

          console.log(navContent.attr("name"));

          const nm = navContent.attr("name");
          const cv = navContent.attr("content");

          if (nm === "cover") {
            const pic = $(`item[id~="${cv}"]`);
            const url = pic.attr("href");
            const realLink = path.join(folderPath, url);
            this.Cover = realLink;
            return url;
          }
        }
      }
    }
  }

  async bookData(fld) {
    const fileName = path.basename(this.pth);
    let k;
    if (fld !== undefined) {
      k = [fld];
    } else {
      k = fileName.split(".");
      k.pop();
      const m = k.join(".");
      k = [m];
    }
    const folderPath = path.join(this.des, k[0]);
    const ifExists = await fs.access(folderPath).then(() => true).catch(() => false);

    if (ifExists) {
      console.log(k);

      const flds = await fs.readdir(folderPath);

      let opPresent = true;

      for (const f of flds) {
        const subFolderPath = path.join(folderPath, f);
        const isDirectory = (await fs.lstat(subFolderPath)).isDirectory();

        if ((f.includes("O") || f.includes("o")) && isDirectory) {
          opPresent = false;
          const bookFiles = await fs.readdir(subFolderPath);

          for (const i of bookFiles) {
            if (i.includes(".ncx")) {
              const ncxFilePath = path.join(subFolderPath, i);
              const rd = await fs.readFile(ncxFilePath, "utf8");
              const $ = cheerio.load(rd);
              const navContent = $("navMap navPoint");

              let lessons = [];
              for (const p of navContent) {
                const point = $(p);
                let name = point.find("navLabel").text().replace(/\s+/g, " ").trim();
                const link = point.find("content").attr("src");
                const realLink = path.join(subFolderPath, link);
                lessons.push({
                  name: name,
                  link: realLink,
                });
              }

              this.Chapters = lessons;
              return { Chapters: lessons };
            }
          }
        }
      }

      if (opPresent) {
        const bookFiles = await fs.readdir(folderPath);

        for (const i of bookFiles) {
          if (i.includes(".ncx")) {
            const ncxFilePath = path.join(folderPath, i);
            const rd = await fs.readFile(ncxFilePath, "utf8");
            const $ = cheerio.load(rd);
            const navContent = $("navMap navPoint");

            let lessons = [];
            for (const p of navContent) {
              const point = $(p);
              let name = point.find("navLabel").text().replace(/\s+/g, " ").trim();
              const link = point.find("content").attr("src");
              const realLink = path.join(folderPath, link);

              lessons.push({
                name: name,
                link: realLink,
              });
            }

            this.Chapters = lessons;
            return { Chapters: lessons };
          }
        }
      }
    }
  }

  saythings() {
    console.log(this.pth, this.des);
  }
}

// Example usage
// let bk = new Book(
//   "/path/to/your/file.epub",
//   "/path/to/destination/folder"
// );

// async function somethign() {
//   let y = await bk.init();
//   let n = await bk.getCover();
//   await bk.bookData();
//   console.log(bk.Name, bk.Cover, " here", y);
// }

// somethign();

module.exports = Book;
