# backend/app/main.py
from fastapi import FastAPI
from app.routes import upload, medical

app = FastAPI(title="Medical Signal Viewer Backend")

# Include upload router
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(medical.router, prefix="/medical", tags=["Medical"])


@app.get("/")
def root():
    return {"message": "Backend is running!"}
