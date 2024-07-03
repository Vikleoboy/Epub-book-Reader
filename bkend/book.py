import os
import shutil
import zipfile

from bs4 import BeautifulSoup


class Book:
    def __init__(self, pth, des, by_zip=False):
        self.pth = pth
        self.des = des
        self.by_zip = by_zip
        self.Cover = None
        self.Name = None
        self.Chapters = None

    def sayhell(self):
        print("HELLL NOOO")

    def init(self):
        fileName = os.path.basename(self.pth)
        isFile = os.path.exists(self.pth)

        print(fileName, isFile)
        if fileName.endswith(".epub") and isFile:
            k = fileName.split(".")
            k.pop()
            print(k)
            m = ".".join(k)
            k = [m]

            # Create a temporary ZIP file
            temp_zip_path = os.path.join(self.des, k[0] + ".zip")
            shutil.copyfile(self.pth, temp_zip_path)

            # Extract the EPUB contents
            with zipfile.ZipFile(temp_zip_path, "r") as zip_ref:
                zip_ref.extractall(os.path.join(self.des, k[0]))

            os.remove(temp_zip_path)

            return 1
        else:
            print("Not an EPUB file")
            return 0

    def get_cover(self, fld=None):
        fileName = os.path.basename(self.pth)
        if fld:
            k = [fld]
        else:
            k = fileName.split(".")
            k.pop()
            m = ".".join(k)
            k = [m]

        book_folder = os.path.join(self.des, k[0])
        flds = os.listdir(book_folder)
        flds = [f for f in flds if not f.startswith(".")]  # Remove hidden files

        opf_present = [f for f in flds if f.endswith(".opf")]
        print(opf_present, "here ")
        for f in flds:
            know = os.path.isdir(os.path.join(self.des, k[0], f))
            inside_files = []
            if know:
                inside_files = os.listdir(os.path.join(book_folder, f))
                inside_files = [f for f in inside_files if not f.startswith(".")]
                print([f for f in inside_files if f.endswith(".opf")])

            if (
                not opf_present
                and any(f.endswith(".opf") for f in inside_files)
                and know
            ):
                opf_present = False
                book_files = os.listdir(os.path.join(self.des, k[0], f))

                for i in book_files:
                    if i.endswith(".opf"):
                        print("in the opf")
                        opf_file_path = os.path.join(self.des, k[0], f, i)
                        with open(opf_file_path, "r", encoding="utf-8") as opf_file:
                            soup = BeautifulSoup(opf_file, "xml")
                            meta_cover = soup.find("meta", attrs={"name": "cover"})
                            book_name = soup.find("dc:title").text.strip()

                            print(meta_cover)

                            self.Name = book_name
                            print(book_name, meta_cover)
                            if meta_cover and meta_cover["name"] == "cover":
                                cover_id = meta_cover["content"]
                                pic = soup.find("item", attrs={"id": cover_id})
                                if pic:
                                    url = pic.get("href")
                                    real_link = os.path.join(self.des, k[0], f, url)
                                    self.Cover = real_link.replace("\\", "/")
                                    return url
                            else:
                                self.Cover = "NotFound"
            else:
                pass

        if opf_present and len(opf_present) > 0:
            book_files = os.listdir(os.path.join(self.des, k[0]))
            for i in book_files:
                if i.endswith(".opf"):
                    opf_file_path = os.path.join(self.des, k[0], i)
                    with open(opf_file_path, "r", encoding="utf-8") as opf_file:
                        soup = BeautifulSoup(opf_file, "xml")
                        meta_cover = soup.find("meta", attrs={"name": "cover"})
                        book_name = soup.find("dc:title").text.strip()

                        if not meta_cover:
                            meta_cover = soup.find("opf:meta", attrs={"name": "cover"})

                        self.Name = book_name
                        if meta_cover and meta_cover["name"] == "cover":
                            cover_id = meta_cover["content"]
                            pic = soup.find("item", attrs={"id": cover_id})
                            if pic:
                                url = pic.get("href")
                                real_link = os.path.join(self.des, k[0], url)
                                self.Cover = real_link.replace("\\", "/")
                                return url
                        else:
                            self.Cover = "NotFound"

    def book_data(self, fld=None):
        fileName = os.path.basename(self.pth)
        if fld:
            k = [fld]
        else:
            k = fileName.split(".")
            k.pop()
            m = ".".join(k)
            k = [m]

        if_exists = os.path.exists(os.path.join(self.des, k[0]))

        if if_exists:
            print(k)

            book_folder = os.path.join(self.des, k[0])
            flds = os.listdir(book_folder)
            print(flds)
            flds = [f for f in flds if not f.startswith(".")]
            op_present = [f for f in flds if f.endswith(".ncx")]
            print(op_present, "here")

            for f in flds:
                know = os.path.isdir(os.path.join(self.des, k[0], f))
                print(know, "know")

                inside_files = []
                if know:
                    inside_files = os.listdir(os.path.join(book_folder, f))
                    inside_files = [f for f in inside_files if not f.startswith(".")]
                    print([f for f in inside_files if f.endswith(".ncx")], inside_files)

                if (
                    len(op_present) == 0
                    and any(f.endswith(".ncx") for f in inside_files)
                    and know
                ):
                    op_present = False
                    book_files = os.listdir(os.path.join(self.des, k[0], f))

                    for i in book_files:
                        if i.endswith(".ncx"):
                            ncx_file_path = os.path.join(self.des, k[0], f, i)
                            with open(ncx_file_path, "r", encoding="utf-8") as ncx_file:
                                soup = BeautifulSoup(ncx_file, "xml")
                                nav_content = soup.select("navMap navPoint")

                                lessons = []
                                for point in nav_content:
                                    name = (
                                        point.find("navLabel")
                                        .text.strip()
                                        .replace("  ", "")
                                        .replace("\t", "")
                                        .replace("\n", "")
                                    )
                                    link = point.find("content")["src"]
                                    real_link = os.path.join(self.des, k[0], f, link)
                                    lessons.append(
                                        {
                                            "name": name,
                                            "link": real_link.replace("\\", "/"),
                                        }
                                    )

                                self.Chapters = lessons
                                return {
                                    "Chapters": lessons,
                                }
                else:
                    print("Something wrong")

            if op_present and len(op_present) > 0:
                book_files = os.listdir(os.path.join(self.des, k[0]))
                for i in book_files:
                    if i.endswith(".ncx"):
                        ncx_file_path = os.path.join(self.des, k[0], i)
                        with open(ncx_file_path, "r", encoding="utf-8") as ncx_file:
                            soup = BeautifulSoup(ncx_file, "xml")
                            nav_content = soup.select("navMap navPoint")

                            lessons = []
                            for point in nav_content:
                                name = (
                                    point.find("navLabel")
                                    .text.strip()
                                    .replace("  ", "")
                                    .replace("\t", "")
                                    .replace("\n", "")
                                )
                                link = point.find("content")["src"]
                                real_link = os.path.join(self.des, k[0], link)
                                lessons.append(
                                    {
                                        "name": name,
                                        "link": real_link.replace("\\", "/"),
                                    }
                                )

                            self.Chapters = lessons
                            return {
                                "Chapters": lessons,
                            }
        else:
            print("Book folder does not exist")

    def saythings(self):
        print(self.pth, self.des)


# Example usage:
# bk = Book(
#     "E:\\books\\e.epub",
#     "C:\\Users\\vikle\\Documents\\GitHubProjects\\Epub-book-Reader\\bkend\\books",
# )
# # await bk.init()
# p = bk.get_cover("me")
# k = bk.book_data("me")
# print(k)
# print(p)
# bk.book_data()

# Modify paths and call methods as needed
