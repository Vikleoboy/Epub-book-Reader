from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import json
import base64
from addFolder import AddFolder
from addBook import AddBook, writeData
from func import intalise, ReadData, delBook , generate_unique_id

app = FastAPI()

# CORS middleware to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this based on your actual requirements
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

mainDes = os.path.abspath("books")
epubFolderDes = os.path.abspath("epubBooks")

intalise()


def safe_path(directory, filename):
    # Build the absolute path
    safe_path = os.path.abspath(os.path.join(directory, filename))
    # Ensure the path is within the directory
    if not safe_path.startswith(os.path.abspath(directory)):
        raise HTTPException(status_code=404, detail="File not found")
    return safe_path


@app.get("/delBook")
async def del_book(id: str):

    # Read and parse the JSON files
    bk = ReadData("b")
    data_sub = bk["Sub"]
    data = bk["Main"]
    

    for index, book in enumerate(data_sub["Books"]):
        if book.get("id") == id:
            bookid = id 
            del data_sub["Books"][index]
            del data["Books"][index]

    try:
        # Update the main and sub data files
        writeData(data_sub, "Database/Sub.json")
        writeData(data, "Database/Main.json")
        delBook(bookid , mainDes , epubFolderDes )
        return {"res": "Book deleted successfully"}
    except Exception:
        raise HTTPException(status_code=404, detail="Tag not found")

@app.get("/getBookMarks")
async def get_book_marks(id: str):
    # Read and parse the JSON file
    bk = ReadData("s")["Sub"]

    books = bk.get("Books", [])

    for book in books:
        if book.get("id") == id:
            print('in here ' , book.get('BookMarks'))
            return  { 'BookMarks' : book.get("BookMarks")}

    raise HTTPException(status_code=404, detail="Book not found")


@app.post("/delBookMark")
async def del_book_bookmark(req_data: dict):
    id = req_data.get("id")
    Tag = req_data.get("mark")
    Name = req_data.get("mark")



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
        return {"res": "Tag deleted successfully"}
    except Exception:
        raise HTTPException(status_code=404, detail="Tag not found")


@app.post("/addBookMark")
async def add_book_bookmark(req_data: dict):
    id = req_data.get("id")
    name = req_data.get('name')
    cfiValue = req_data.get("cfiValue")

    # Read and parse the JSON files
    bk = ReadData("b")
    data_sub = bk["Sub"]
    data = bk["Main"]

    for index, book in enumerate(data_sub["Books"]):
        if book.get("id") == id:
            bookid = generate_unique_id(8)
            book["BookMarks"].append({ 'id' : bookid , 'name' : name , 'cfiValue' : cfiValue})
            data["Books"][index]["BookMarks"].append({ 'id' : bookid , 'name' : name , 'cfiValue' : cfiValue})
                # Update the main and sub data files

    try:
        writeData(data_sub, "Database/Sub.json")
        writeData(data, "Database/Main.json")
        return {"res": "Tag added successfully"}
    except Exception:
        raise HTTPException(status_code=404, detail="Tag not found")



@app.post("/delBookTag")
async def del_book_tag(req_data: dict):
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
        return {"res": "Tag deleted successfully"}
    except Exception:
        raise HTTPException(status_code=404, detail="Tag not found")


@app.get("/delTag")
async def del_tag(tagName: str):
    bk = ReadData("b")
    data_sub = bk["Sub"]
    data_main = bk["Main"]

    if tagName in data_sub["Tags"]:
        data_main["Tags"].remove(tagName)
        data_sub["Tags"].remove(tagName)

        # Save the updated JSON data back to the files
        writeData(data_sub, "Database/Sub.json")
        writeData(data_main, "Database/Main.json")
        return {"res": "Done"}
    else:
        return {"res": "NVP"}


@app.get("/addTag")
async def add_tag(tagName: str):
    bk = ReadData("b")
    data_sub = bk["Sub"]
    data_main = bk["Main"]

    if tagName and tagName not in data_sub["Tags"]:
        data_main["Tags"].append(tagName)
        data_sub["Tags"].append(tagName)

        # Save the updated JSON data back to the files
        writeData(data_sub, "Database/Sub.json")
        writeData(data_main, "Database/Main.json")
        return {"res": "Done"}
    else:
        return {"res": "NVP"}


@app.post("/addBookTag")
async def add_book_tag(req_data: dict):
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
        return {"res": "Tag added successfully"}
    except Exception:
        raise HTTPException(status_code=404, detail="Tag not found")


@app.get("/Read")
async def read(id: str):
    print(f"{id} this is id of read ")

    # Read and parse the JSON files
    data_sub = ReadData("s")["Sub"]

    if "Books" in data_sub and len(data_sub["Books"]) > 0:
        for book in data_sub.get("Books", []):
            if book.get("id") == id:
                book_id = book.get("id")

                return {"url": f"http://localhost:3002/epubBooks/{book_id}.epub"}

    raise HTTPException(status_code=404, detail="Book not found")


@app.get("getBook")
async def getbook(id : str) : 
    # Read and parse the JSON file
    bk = ReadData("s")["Sub"]

    books = bk.get("Books", [])

    for book in books:
        if book.get('id') == id :
            return book

    raise HTTPException(status_code=404, detail="Book not found")


@app.get("/getCover")
async def get_cover(id: str):
    # Read and parse the JSON file
    bk = ReadData("s")["Sub"]

    books = bk.get("Books", [])
    

    for book in books:


        if id == book.get("id") and book is not None:
            cover_path = book.get("Cover")
            if cover_path == 'NotFound' :  
                return {"img": NotFound}

            if cover_path and os.path.exists(cover_path):
                try:
                    with open(cover_path, "rb") as cover_file:
                        bitmap = cover_file.read()
                        img_base64 = base64.b64encode(bitmap).decode("utf-8")
                        return {"img": img_base64}
                except Exception as e:
                    raise HTTPException(
                        status_code=500, detail="Error reading cover image"
                    )

    raise HTTPException(status_code=404, detail="Cover not found")


@app.get("/getTags")
async def get_main_tags():
    # Read and parse the JSON file
    bk = ReadData("s")["Sub"]

    Tags = bk.get("Tags", [])
    return {"Tags": Tags}


@app.get("/getBookTags")
async def get_book_tags(id: str):
    # Read and parse the JSON file
    bk = ReadData("s")["Sub"]

    books = bk.get("Books", [])

    for book in books:
        if book.get("id") == id:
            return {"Tags": book.get("Tags")}

    raise HTTPException(status_code=404, detail="Book not found")


@app.get("/home")
async def home(tag: str = None):
    # Read and parse the JSON file
    print(tag)
    bk = ReadData("s")["Sub"]

    books = bk.get("Books", [])

    if tag:
        books = [book for book in books if tag in book.get("Tags", [])]

    if books:
        return {"info": books}
    else:
        raise HTTPException(status_code=404, detail="No books found")


@app.get("/addFolder")
async def add_folder(path: str):
    path = path.replace('"', "")
    print(path, "hi")
    AddFolder(path, mainDes, epubFolderDes)
    return path


@app.get("/addBook")
async def add_book(path: str):
    file = path.replace('"', "")
    print(file)
    AddBook(file, mainDes, epubFolderDes)
    return file


@app.get("/")
async def hello_world():
    print("say hello")
    return {"message": "Hello, World!"}


@app.get("/epubBooks/{filename}")
async def serve_epub_books(filename: str):
    try:
        # Ensure the file path is safe
        safe_file_path = safe_path(epubFolderDes, filename)
        return FileResponse(safe_file_path)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="localhost", port=3002 , log_level = 'info' ,reload = True)
