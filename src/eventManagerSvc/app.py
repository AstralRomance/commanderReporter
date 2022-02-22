from fastapi import FastAPI

from .api import router

app = FastAPI(docs_url='/event-manager-api/swagger', redoc_url='/event-manager-api/redoc', openapi_url='/event-manager-api/openapi.json')
app.include_router(router)
