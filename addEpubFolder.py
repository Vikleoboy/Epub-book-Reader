
import sys
import os
import zipfile
import shutil
import uuid


arg = sys.argv[1:]
fil = arg[0][0]
# epubFolder = arg[1]


print(fil)


# print("Script Name is:", sys.argv[0])

# print("Arguments are:", sys.argv[1:])

# AllFile = os.listdir(fil)



# for fl in AllFile:
#     try : 
#         id = uuid.uuid4()
#         filePath = os.path.join(fil, fl)
#         if filePath.endswith('.epub'):
#             print(fl, filePath)
#         if filePath.endswith('.epub') and os.path.isfile(filePath) and os.path.isdir(epubFolder):
            
#             epubDes = os.path.join(epubFolder,id)
            
#             shutil.copy(filePath,epubDes + '.epub')
          
#     except :
#         continue
#         print('yo problem ')
