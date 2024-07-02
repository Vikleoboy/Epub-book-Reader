from flask import Flask
from addFolder import AddFolder
from addBook import AddBook
import os
from flask import request
from func import intalise

app = Flask(__name__)
app.debug = True

mainDes = os.path.abspath("books")
epubFolderDes = os.path.abspath("epubBooks")

intalise()


@app.route("/")
def hello_world():
    print("say hello")
    return "<p>Hello, World!</p>"


@app.route("/addFolder")
def Folder():
    pathfolder = request.args.get("path")
    pathfolder = pathfolder.replace('"', "")
    print(pathfolder, "hi")
    AddFolder(pathfolder, mainDes, epubFolderDes)
    return pathfolder


@app.route("/addBook")
def addBook():
    file = request.args.get("path")
    file = file.replace('"', "")
    print(file)
    AddBook(file, mainDes, epubFolderDes)
    return file


if __name__ == "__main__":
    app.run(host="localhost", port=3002)
