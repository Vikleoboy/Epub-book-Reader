import sys
import os
import zipfile
import shutil

arg = sys.argv[1:]
filePath = arg[0]
dest = arg[1]
epubFolder = arg[2]
id = arg[3]


print(os.path.isfile(filePath), os.path.isdir(dest))


def AddFolder():
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
    except:
        print("yo bro problem here ")
