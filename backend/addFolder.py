import sys
import os
import zipfile
import shutil

import json
from book import Book
from func import ReadData, bookTemp, writeData,generate_unique_id
import pathlib



def AddFolder(pth, dest, epubDes):

    print("in the AddFolder")
    AllFile = os.listdir(pth)
    rd = ReadData("b")
    dum = rd["Sub"]["Books"]
    dum2 = rd["Main"]["Books"]
    for fl in AllFile:
        id = generate_unique_id(8)
        try:
            filePath = os.path.join(pth, fl)

            if (
                filePath.endswith(".epub")
                and os.path.isfile(filePath)
                and os.path.isdir(dest)
            ):
                fileName = os.path.basename(filePath)
                fileName = fileName.replace(".epub", "")
                destFolder = os.path.join(dest, id)
                epubdes = os.path.join(epubDes, id)

                try:
                    shutil.copy(filePath, destFolder + ".zip")
                    shutil.copy(filePath, epubdes + ".epub")
                except:
                    print("error")

                with zipfile.ZipFile(destFolder + ".zip", "r") as zip_ref:
                    zip_ref.extractall(destFolder)

                os.remove(destFolder + ".zip")

                try:
                    book = Book("", dest)
                    book.get_cover(id)
                    book.book_data(id)
                except Exception as error:
                    print("ERROR ", error)
                # Logic to see if the book alredy exits in the Database
                # can add logic with orgin folder which will be better but i am leaveing it for now
                add = True
                tempSub = bookTemp(id, book.Name, book.Cover, destFolder)

                for i in dum:
                    if tempSub["Name"] == i["Name"]:
                        print("alredy in the database")
                        add = False

                if add:
                    dum.append(tempSub)
                    dum2.append(
                        bookTemp(id, book.Name, book.Cover, destFolder, book.Chapters)
                    )
                else:
                    os.remove(os.path.join(epubDes , id) + ".epub")
                    shutil.rmtree(os.path.join(dest, id))
                    
        except:
            print("yo problem ")
            continue
        rd["Sub"]["Books"] = dum
        rd["Main"]["Books"] = dum2
        writeData(rd["Sub"], "Database/Sub.json")
        writeData(rd["Main"], "Database/Main.json")


# d = ReadData("s")["Sub"]

# books = d["Books"]
# books.append(bookTemp("sdf", "Vivek", "viverk", "/sdf"))
# d["Books"] = books
# writeData(d, "Database/Sub.json")
# print(ReadData("s"))