from pydantic import BaseSettings


class Settings(BaseSettings):
    event_svc_host: str
    event_svc_port: int
    database_url: str


settings = Settings(
    _env_file='.env',
    _env_file_encoding='utf-8'
)
