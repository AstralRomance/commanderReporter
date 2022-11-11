import uvicorn

from .settings import settings

uvicorn.run(
    'eventManagerSvc.app:app',
    host=settings.database_svc_host,
    port=settings.database_svc_port,
    reload=True,
)
