from fastapi import FastAPI
from app.routes import upload, medical


app = FastAPI(title="Medical Signal Viewer Backend")

app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(medical.router)

@app.get("/")
def root():
    return {"message": "Backend is running!"}
