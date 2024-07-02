import sys
import os
import zipfile
import shutil
import secrets
import string
import json


def generate_unique_id(length=6):
    # Define the alphabet: you can customize this
    alphabet = string.ascii_letters + string.digits

    # Generate a random string of the specified length
    unique_id = "".join(secrets.choice(alphabet) for _ in range(length))

    return unique_id


def ReadData(mode="b"):
    with open("Database/Sub.json", "r") as Sub:
        SubData = json.load(Sub)
        SubData = initData(SubData)
    with open("Database/Main.json", "r") as Main:
        MainData = json.load(Main)
        MainData = initData(MainData)
    print(SubData, "here")
    if mode == "b":
        return {"Sub": SubData, Main: MainData}
    elif mode == "s":
        return {"Sub": SubData}
    elif mode == "m":
        return {"Main": MainData}


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


def initData(Data):
    if not "Books" in Data:
        Data["Books"] = []
    if not "Tags" in Data:
        Data["Tags"] = []
    return Data


def writeData(data, pth):
    ex = os.path.exists(pth)
    if ex:
        with open(pth, "w") as json_file:
            json.dump(data, json_file, indent=4)
    return


def bookTemp(id, name, cover, base, chapters=None):
    if chapters == None:
        return {"id": id, "Name": "name", "Cover": cover, "base": base, "Tags": []}
    else:
        return {
            "id": id,
            "Name": name,
            "Cover": cover,
            "base": base,
            "Tags": [],
            "Chapters": chapters,
        }


d = ReadData("s")["Sub"]

books = d["Books"]
books.append(bookTemp("sdf", "Vivek", "viverk", "/sdf"))
d["Books"] = books
writeData(d, "Database/Sub.json")
print(ReadData("s"))
