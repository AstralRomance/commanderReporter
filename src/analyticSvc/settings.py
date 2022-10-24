from pydantic import BaseSettings


class Settings(BaseSettings):
    analytic_svc_host: str
    analytic_svc_port: int
    database_url: str


settings = Settings(
    _env_file='.env',
    _env_file_encoding='utf-8'
)
