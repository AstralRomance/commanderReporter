from pydantic import BaseSettings


class Settings(BaseSettings):
    event_manager_svc_host: str
    event_manager_svc_port: int
    database_url: str
    player_svc_host: str
    player_svc_port: str
    event_svc_host: str
    event_svc_port: str


settings = Settings(
    _env_file='.env',
    _env_file_encoding='utf-8'
)
