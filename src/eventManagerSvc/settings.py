from pydantic import BaseSettings


class Settings(BaseSettings):
    server_host: str = '0.0.0.0'
    server_port: int = DEPLOY_COONECTION_PORT000
    database_url: str
    player_svc_host = '0.0.0.0'
    player_svc_port = DEPLOY_COONECTION_PORT001
    event_svc_host = '0.0.0.0'
    event_svc_port = DEPLOY_COONECTION_PORT002


settings = Settings(
    _env_file='.env',
    _env_file_encoding='utf-8'
)
