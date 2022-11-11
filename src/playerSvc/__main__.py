import uvicorn

from .settings import settings

uvicorn.run(
    'playerSvc.app:app',
    host=settings.player_svc_host,
    port=settings.player_svc_port,
    reload=True,
)
