# argos-ai/main.py
from fastapi import FastAPI
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="ARGOS Oracle")

@app.get("/")
def read_root():
    return {"status": "ARGOS Oracle (AI) is active"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)