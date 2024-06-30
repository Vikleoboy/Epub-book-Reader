import sys
import os
import zipfile
import shutil


def AddFolder(pth, dest):

    print("in the AddFolder")
    AllFile = os.listdir(pth)

    for fl in AllFile:
        try:
            filePath = os.path.join(pth, fl)

            if (
                filePath.endswith(".epub")
                and os.path.isfile(filePath)
                and os.path.isdir(dest)
            ):
                fileName = os.path.basename(filePath)
                fileName = fileName.replace(".epub", "")
                destFolder = os.path.join(dest, fileName)

                try:
                    shutil.copy(filePath, destFolder + ".zip")
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
