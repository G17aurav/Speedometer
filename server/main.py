# backend/main.py
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from time import perf_counter

app = FastAPI()

# Allow frontend (adjust origin if deploying)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "FastAPI is working!"}

@app.post("/upload-speed")
async def upload_speed(file: UploadFile):
    start = perf_counter()
    data = await file.read()
    duration = perf_counter() - start
    print(duration)
    file_size_MB = len(data) / (1024 * 1024)
    speed_mbps = (file_size_MB * 8) / duration

    return {"upload_speed_mbps": speed_mbps}

