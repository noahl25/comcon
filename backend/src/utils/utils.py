import os
from fastapi import UploadFile
from sqlalchemy import null

# Writes image to folder then returns the path or SQL null if None.
def write_image(image: UploadFile | None):

    image_location = null()

    if image and image.filename:
        # Autoincrement filename if name exists already then write to folder.
        i = 0
        file = image.filename.split(".")[0]
        type = image.filename.split(".")[1]
        while os.path.exists(f"{file}{i}.{type}"):
            i += 1

        file_name = f"{file}{i}.{type}"

        os.makedirs("images", exist_ok=True)
        image_location = os.path.join("images", file_name)
        with open(image_location, "wb") as file:
            file.write(image.file.read())
    
    return file_name
    

