import uvicorn

from .settings import settings

uvicorn.run(
    'eventManagerSvc.app:app',
    host=settings.event_manager_svc_host,
    port=settings.event_manager_svc_port,
    reload=True,
)
