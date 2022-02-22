from fastapi import FastAPI

from .api import router

app = FastAPI(docs_url='/players-api/swagger', redoc_url='/players-api/redoc', openapi_url='/players-api/openapi.json')
app.include_router(router)
