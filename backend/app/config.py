from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # --- Application ---
    app_base_url: str = "http://localhost:8000"
    frontend_url: str = "http://localhost:5173"

    # --- Database ---
    db_host: str = "127.0.0.1"
    db_port: int = 5432
    db_user: str = "postgres"
    db_password: str = ""
    db_name: str = "app"

    # --- Auth ---
    jwt_secret_key: str = "change-this-in-production"
    jwt_access_token_minutes: int = 60 * 3
    jwt_refresh_token_minutes: int = 60 * 24 * 7

    # --- Email (optional) ---
    email_smtp_host: str = ""
    email_smtp_port: int = 587
    email_smtp_user: str = ""
    email_smtp_password: str = ""
    email_from_address: str = "noreply@example.com"
    password_reset_token_minutes: int = 60

    # --- S3 (optional) ---
    s3_endpoint_url: str = ""
    s3_access_key_id: str = ""
    s3_secret_access_key: str = ""
    s3_bucket_name: str = ""
    s3_region: str = "auto"
    s3_public_url: str = ""

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )

    model_config = {"env_file": ".env", "extra": "ignore"}


settings: Settings = Settings()
