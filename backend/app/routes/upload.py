# backend/app/routes/upload.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
import shutil

router = APIRouter()

# Folder to store uploaded CSV files
UPLOAD_FOLDER = Path(__file__).parent.parent / "uploads"
UPLOAD_FOLDER.mkdir(exist_ok=True)

ALLOWED_SIGNAL_TYPES = ["medical", "acoustic", "stock", "microbiome"]

@router.post("/")
async def upload_signal(file: UploadFile = File(...), signal_type: str = "medical"):
    if signal_type not in ALLOWED_SIGNAL_TYPES:
        raise HTTPException(status_code=400, detail="Invalid signal type")

    # Save uploaded file
    file_path = UPLOAD_FOLDER / file.filename
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    return {"filename": file.filename, "signal_type": signal_type, "path": str(file_path)}
