# main.py
from fastapi import FastAPI
from routers import mtcnn as ml

app = FastAPI(
    title="Modular FastAPI Service",
    version="1.0.0"
)

# Register routers
app.include_router(ml.router)

