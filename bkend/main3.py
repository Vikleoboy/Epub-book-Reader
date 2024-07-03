from flask import Flask, send_from_directory, abort, request, jsonify
from addFolder import AddFolder
from addBook import AddBook, writeData
import os
from func import intalise, ReadData
import base64
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

app.debug = True


mainDes = os.path.abspath("books")
epubFolderDes = os.path.abspath("epubBooks")

intalise()


def safe_path(directory, filename):
    # Build the absolute path
    safe_path = os.path.abspath(os.path.join(directory, filename))
    # Ensure the path is within the directory
    if not safe_path.startswith(os.path.abspath(directory)):
        abort(404)
    return safe_path


# Main Routes


@app.route("/delBookTag", methods=["POST"])
def del_book_tag():
    req_data = request.get_json()
    id = req_data.get("id")
    Tag = req_data.get("Tag")

    # Read and parse the JSON files
    bk = ReadData("b")
    data_sub = bk["Sub"]
    data = bk["Main"]

    for index, book in enumerate(data_sub["Books"]):
        if book.get("id") == id:
            if Tag and Tag in book["Tags"]:
                book["Tags"].remove(Tag)
                data["Books"][index]["Tags"].remove(Tag)
                # Update the main and sub data files

    try:
        writeData(data_sub, "Database/Sub.json")
        writeData(data, "Database/Main.json")
        return jsonify({"res": "Tag added successfully"}), 200
    except Exception:
        return jsonify({"res": "NotFound"}), 404


@app.route("/delTag", methods=["GET"])
def del_tag():
    tagName = request.args.get("tagName")

    bk = ReadData("b")
    data_sub = bk["Sub"]
    data_main = bk["Main"]

    # Add the tag if it doesn't already exist
    print(data_sub)
    if tagName in data_sub["Tags"]:
        data_main["Tags"].remove(tagName)
        data_sub["Tags"].remove(tagName)

        # Save the updated JSON data back to the files
        writeData(data_sub, "Database/Sub.json")
        writeData(data_main, "Database/Main.json")
        return jsonify({"res": "Done"}), 200
    else:
        return jsonify({"res": "NVP"}), 200


@app.route("/addTag", methods=["GET"])
def add_tag():
    tagName = request.args.get("tagName")

    bk = ReadData("b")
    data_sub = bk["Sub"]
    data_main = bk["Main"]

    # Add the tag if it doesn't already exist
    if tagName and tagName not in data_sub["Tags"]:
        data_main["Tags"].append(tagName)
        data_sub["Tags"].append(tagName)

        # Save the updated JSON data back to the files
        writeData(data_sub, "Database/Sub.json")
        writeData(data_main, "Database/Main.json")
        return jsonify({"res": "Done"}), 200
    else:
        return jsonify({"res": "NVP"}), 200


@app.route("/addBookTag", methods=["POST"])
def add_book_tag():
    req_data = request.get_json()
    id = req_data.get("id")
    Tag = req_data.get("Tag")

    # Read and parse the JSON files
    bk = ReadData("b")
    data_sub = bk["Sub"]
    data = bk["Main"]

    for index, book in enumerate(data_sub["Books"]):
        if book.get("id") == id:
            if Tag and Tag not in book["Tags"]:
                book["Tags"].append(Tag)
                data["Books"][index]["Tags"].append(Tag)
                # Update the main and sub data files

    try:
        writeData(data_sub, "Database/Sub.json")
        writeData(data, "Database/Main.json")
        return jsonify({"res": "Tag added successfully"}), 200
    except Exception:
        return jsonify({"res": "NotFound"}), 404


@app.route("/Read", methods=["GET"])
def read():
    id = request.args.get("id")
    print(f"{id} this is id of read ")

    # Read and parse the JSON files
    data_sub = ReadData("s")["Sub"]

    if "Books" in data_sub and len(data_sub["Books"]) > 0:
        for book in data_sub.get("Books", []):
            if book.get("Name") == id:
                book_id = book.get("id")

                return jsonify(
                    {"url": f"http://localhost:3002/epubBooks/{book_id}.epub"}
                )

    return jsonify({"error": "Book not found"}), 404


@app.route("/getCover", methods=["GET"])
def get_cover():
    book_id = request.args.get("id")

    # Read and parse the JSON file
    bk = ReadData("s")["Sub"]

    books = bk.get("Books", [])

    for book in books:
        if book_id == book.get("id") and book is not None:
            cover_path = book.get("Cover")
            if cover_path and os.path.exists(cover_path):
                try:
                    with open(cover_path, "rb") as cover_file:
                        bitmap = cover_file.read()
                        img_base64 = base64.b64encode(bitmap).decode("utf-8")
                        return jsonify({"img": img_base64})
                except Exception as e:
                    return jsonify({"img": "error"}), 500

    return jsonify({"img": "error"}), 404


@app.route("/getTags", methods=["GET"])
def getMainTags():

    # Read and parse the JSON file
    bk = ReadData("s")["Sub"]

    Tags = bk.get("Tags", [])
    return jsonify({"Tags": Tags})


@app.route("/getBookTags", methods=["GET"])
def getBookTags():
    id = request.args.get("id")
    # Read and parse the JSON file
    bk = ReadData("s")["Sub"]

    books = bk.get("Books", [])

    for book in books:
        if book.get("id") == id:
            return jsonify({"Tags": book.get("Tags")})

    return jsonify({"Tags": "NotFound"})


@app.route("/home", methods=["GET"])
def home():
    tag = request.args.get("Tag")

    # Read and parse the JSON file
    bk = ReadData("s")["Sub"]

    books = bk.get("Books", [])

    if books:
        return jsonify({"info": books})
    else:
        return jsonify({"info": "error"}), 404


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


@app.route("/")
def hello_world():
    print("say hello")
    return "<p>Hello, World!</p>"


# @app.route("/books/<path:filename>")
# def serve_books(filename):
#     try:
#         # Ensure the file path is safe
#         safe_file_path = safe_path(mainDes, filename)
#         return send_from_directory(mainDes, filename)
#     except FileNotFoundError:
#         abort(404)


@app.route("/epubBooks/<path:filename>")
def serve_epub_books(filename):
    try:
        # Ensure the file path is safe
        safe_file_path = safe_path(epubFolderDes, filename)
        return send_from_directory(epubFolderDes, filename)
    except FileNotFoundError:
        abort(404)


if __name__ == "__main__":
    app.run(threaded=True, host="localhost", port=3002)
