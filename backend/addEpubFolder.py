import sys
import os
import shutil
import json

# Load JSON data
try:
    with open('./temp.json') as temp:
        tempData = json.load(temp)
except FileNotFoundError:
    print("temp.json file not found.")
    sys.exit(1)
except json.JSONDecodeError:
    print("Error decoding JSON from temp.json.")
    sys.exit(1)

# Ensure command line arguments are provided
if len(sys.argv) < 2:
    print("Usage: script_name.py /path/to/base/directory")
    sys.exit(1)

base = sys.argv[1]

# Set EPUB folder path
epubFolder = r'C:\Users\vikle\Documents\GitHubProjects\Epub-book-Reader\epubBooks'
if not os.path.exists(epubFolder):
    print(f"EPUB folder path {epubFolder} does not exist.")
    sys.exit(1)

# Process each book
for bk in tempData['currentBooks']:
    try:
        epubDes = os.path.join(epubFolder, bk['id']) + '.epub'
        fileName = os.path.join(base, bk['filePath']) + '.epub'
        print(f"Copying from {fileName} to {epubDes}")
        shutil.copy(fileName, epubDes)
    except FileNotFoundError:
        print(f"File {fileName} not found.")
    except Exception as e:
        print(f"Error occurred: {e}")

print("Process completed.")
