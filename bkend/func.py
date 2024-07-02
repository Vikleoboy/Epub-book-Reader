import os


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
