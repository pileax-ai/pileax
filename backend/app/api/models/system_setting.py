from pydantic import BaseModel


class SystemSettingItem(BaseModel):
    key: str
    value: str


class SystemSettingPublic(BaseModel):
    HTTP_PROXY: str | None = None
    DOUBAN_API_KEY: str | None = None
    GOOGLE_API_KEY: str | None = None
