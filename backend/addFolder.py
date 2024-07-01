import sys
import os
import zipfile
import shutil
import secrets
import string


def generate_unique_id(length=6):
    # Define the alphabet: you can customize this
    alphabet = string.ascii_letters + string.digits

    # Generate a random string of the specified length
    unique_id = "".join(secrets.choice(alphabet) for _ in range(length))

    return unique_id


def AddFolder(pth, dest, epubDes):

    print("in the AddFolder")
    AllFile = os.listdir(pth)

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

                # with open(fil, 'r') as src, open(k + ".zip", 'w') as dst:
                #     shutil.copyfileobj(fil, k + ".zip")

                with zipfile.ZipFile(destFolder + ".zip", "r") as zip_ref:
                    zip_ref.extractall(destFolder)

                os.remove(destFolder + ".zip")

        except:
            continue
            print("yo problem ")
