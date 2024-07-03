import sys
import os
import zipfile
import shutil
import uuid
import secrets
import string
from book import Book
from func import ReadData, bookTemp, writeData
import pathlib
import shutil


def generate_unique_id(length=6):
    # Define the alphabet: you can customize this
    alphabet = string.ascii_letters + string.digits

    # Generate a random string of the specified length
    unique_id = "".join(secrets.choice(alphabet) for _ in range(length))

    return unique_id


def AddBook(filePath, dest, epubFolder):
    id = generate_unique_id(8)
    rm = []
    print(os.path.isfile(filePath), dest)
    rd = ReadData("b")
    dum = rd["Sub"]["Books"]
    dum2 = rd["Main"]["Books"]
    try:
        if (
            filePath.endswith(".epub")
            and os.path.isfile(filePath)
            and os.path.isdir(dest)
        ):
            fileName = os.path.basename(filePath)
            fileName = fileName.replace(".epub", "")
            destFolder = os.path.join(dest, id)
            epubDes = os.path.join(epubFolder, id)
            print(id)
            print(filePath, destFolder)
            shutil.copy(filePath, destFolder + ".zip")
            shutil.copy(filePath, epubDes + ".epub")

            with zipfile.ZipFile(destFolder + ".zip", "r") as zip_ref:
                zip_ref.extractall(destFolder)

            os.remove(destFolder + ".zip")

            book = Book("", dest)
            book.get_cover(id)
            book.book_data(id)

            # Logic to see if the book alredy exits in the Database
            # can add logic with orgin folder which will be better but i am leaveing it for now
            tempsub = bookTemp(id, book.Name, book.Cover, destFolder)
            add = True
            for i in dum:
                if tempsub["Name"] == i["Name"]:
                    print("alredy in the database")
                    add = False

            if add:
                dum.append(tempsub)
                dum2.append(
                    bookTemp(id, book.Name, book.Cover, destFolder, book.Chapters)
                )
            else:
                shutil.rmtree(os.path.join(dest, id))
                pathlib.Path.unlink(os.path.join(epubDes) + ".epub")

            rd["Sub"]["Books"] = dum
            rd["Main"]["Books"] = dum2
            writeData(rd["Sub"], "Database/Sub.json")
            writeData(rd["Main"], "Database/Main.json")
            return "done"
    except Exception as error:
        print("yo bro problem here ", error)


# for i in rm :
#     os.remove()
