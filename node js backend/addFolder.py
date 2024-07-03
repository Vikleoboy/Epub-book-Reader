
import sys
import os
import zipfile
import shutil


arg = sys.argv[1:]
fil = arg[0]
dest = arg[1]


print("Script Name is:", sys.argv[0])

print("Arguments are:", sys.argv[1:])

AllFile = os.listdir(fil)


def withoutDs(file) : 
    return '.epub' in file


print(fil, dest)
m = filter(withoutDs,AllFile)

for fl in AllFile :
    try : 
        filePath = os.path.join(fil, fl)
        
            
        if filePath.endswith('.epub') and os.path.isfile(filePath) and os.path.isdir(dest):
            fileName = os.path.basename(filePath)
            fileName = fileName.replace('.epub', '')
            destFolder = os.path.join(dest, fileName)
            
           
            try : 
                shutil.copy(filePath, destFolder + ".zip")
            except:
                print('error')
            
            # with open(fil, 'r') as src, open(k + ".zip", 'w') as dst:
            #     shutil.copyfileobj(fil, k + ".zip")

            with zipfile.ZipFile(destFolder + ".zip", 'r') as zip_ref:
                zip_ref.extractall(destFolder)

            try:
                os.remove(destFolder + ".zip")
            except:
                print('error in f')
    except :
        continue
        print('yo problem ')
