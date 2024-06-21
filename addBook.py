import sys
import os
import zipfile
import shutil

arg = sys.argv[1:]
dest = fr"{arg[-1]}"
filePath = fr"\\?\{arg[0]}"


print(os.path.isfile(filePath), os.path.isdir(dest) )
try  : 
    if filePath.endswith('.epub') and os.path.isfile(filePath) and os.path.isdir(dest):
        fileName = os.path.basename(filePath)
        fileName = fileName.replace('.epub', '')
        destFolder = fr"\\?\{os.path.join(dest, fileName)}"
        print(filePath, destFolder)
        shutil.copy( filePath,  destFolder )

        with zipfile.ZipFile( destFolder + ".zip", 'r') as zip_ref:
            zip_ref.extractall(destFolder)

        os.remove(destFolder + ".zip")
except : 
    print('yo bro problem here ')