from pydantic import BaseSettings


class Settings(BaseSettings):
    player_svc_host: str
    player_svc_port: int
    database_url: str


settings = Settings(
    _env_file='.env',
    _env_file_encoding='utf-8'
)
