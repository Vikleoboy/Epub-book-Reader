import sys
import os
import zipfile
import shutil
import uuid
import secrets
import string


def generate_unique_id(length=6):
    # Define the alphabet: you can customize this
    alphabet = string.ascii_letters + string.digits

    # Generate a random string of the specified length
    unique_id = "".join(secrets.choice(alphabet) for _ in range(length))

    return unique_id


def AddBook(filePath, dest, epubFolder):
    id = generate_unique_id(8)
    print(os.path.isfile(filePath), dest)
    try:
        if (
            filePath.endswith(".epub")
            and os.path.isfile(filePath)
            and os.path.isdir(dest)
        ):
            fileName = os.path.basename(filePath)
            fileName = fileName.replace(".epub", "")
            destFolder = os.path.join(dest, fileName)
            epubDes = os.path.join(epubFolder, id)
            print(id)
            print(filePath, destFolder)
            shutil.copy(filePath, destFolder + ".zip")
            shutil.copy(filePath, epubDes + ".epub")

            with zipfile.ZipFile(destFolder + ".zip", "r") as zip_ref:
                zip_ref.extractall(destFolder)

            os.remove(destFolder + ".zip")

            return "done"
    except Exception as error:
        print("yo bro problem here ", error)
