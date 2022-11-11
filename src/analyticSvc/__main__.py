import uvicorn

from .settings import settings

uvicorn.run(
    'analyticSvc.app:app',
    host=settings.analytic_svc_host,
    port=settings.analytic_svc_port,
    reload=True,
)
