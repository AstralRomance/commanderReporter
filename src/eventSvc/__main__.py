import uvicorn

from .settings import settings

uvicorn.run(
    'eventSvc.app:app',
    host=settings.event_svc_host,
    port=settings.event_svc_port,
    reload=True,
)
