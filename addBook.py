import sys
import os
import zipfile
import shutil

arg = sys.argv[1:]
dest = arg[-1]
filePath = arg[0]


print(os.path.isfile(filePath), os.path.isdir(dest))
if filePath.endswith('.epub') and os.path.isfile(filePath) and os.path.isdir(dest):
    fileName = os.path.basename(filePath)
    fileName = fileName.replace('.epub', '')
    destFolder = os.path.join(dest, fileName)
    print(filePath, destFolder)
    shutil.copy(filePath, destFolder + ".zip")

    with zipfile.ZipFile(destFolder + ".zip", 'r') as zip_ref:
        zip_ref.extractall(destFolder)

    os.remove(destFolder + ".zip")
