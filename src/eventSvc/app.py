from fastapi import FastAPI

from .api import router

app = FastAPI(docs_url='/events-api/swagger', redoc_url='/events-api/redoc', openapi_url='/events-api/openapi.json')
app.include_router(router)
