import os
import json


def intalise():
    if not os.path.exists("books"):
        os.mkdir("books")
    if not os.path.exists("epubBooks"):
        os.mkdir("epubBooks")
    if not os.path.exists("Database"):
        os.mkdir("Database")
        sub = open("Database/Sub.json", "w")
        sub.write("{}")
        sub.close
        main = open("Database/Main.json", "w")
        main.write("{}")
        main.close


def initData(Data):
    if not "Tags" in Data:
        Data["Tags"] = []
    if not "Books" in Data:
        Data["Books"] = []
    return Data


def ReadData(mode="b"):
    with open("Database/Sub.json", "r") as Sub:
        SubData = json.load(Sub)
        SubData = initData(SubData)
    with open("Database/Main.json", "r") as Main:
        MainData = json.load(Main)
        MainData = initData(MainData)
    if mode == "b":
        return {"Sub": SubData, "Main": MainData}
    elif mode == "s":
        return {"Sub": SubData}
    elif mode == "m":
        return {"Main": MainData}


def writeData(data, pth):
    ex = os.path.exists(pth)
    if ex:
        with open(pth, "w") as json_file:
            json.dump(data, json_file, indent=4)
    return


def bookTemp(id, name, cover, base, chapters=None):
    if chapters == None:
        return {"id": id, "Name": name, "Cover": cover, "base": base, "Tags": []}
    else:
        return {
            "id": id,
            "Name": name,
            "Cover": cover,
            "base": base,
            "Tags": [],
            "Chapters": chapters,
        }
