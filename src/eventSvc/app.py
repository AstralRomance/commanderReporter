from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from .api import router


origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8002",
]

app = FastAPI(docs_url='/events-api/swagger', redoc_url='/events-api/redoc', openapi_url='/events-api/openapi.json')
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)
