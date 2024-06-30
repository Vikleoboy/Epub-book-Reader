from flask import Flask
from addFolder import AddFolder
import os
from flask import request


app = Flask(__name__)
mainDes = os.path.abspath("books")


@app.route("/")
def hello_world():
    print("say hello")
    return "<p>Hello, World!</p>"


@app.route("/addFolder")
def Folder():
    pathfolder = request.args.get("path")
    print(pathfolder, "hi")
    AddFolder(pathfolder, mainDes)
    return pathfolder


@app.route("/addBook")
def addBook():
    file = request.args.get("path")
    file = file.replace('"', "")
    print(file)
    return file
