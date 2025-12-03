from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, Text, DateTime
from datetime import datetime

class Base(DeclarativeBase):
    pass

class RoomModel(Base):
    __tablename__ = "rooms"
    id: Mapped[str] = mapped_column(String(16), primary_key=True)
    code: Mapped[str] = mapped_column(Text)
    language: Mapped[str] = mapped_column(String(16))
    task: Mapped[str] = mapped_column(Text, default="")
    taskTitle: Mapped[str] = mapped_column(String(256), default="")
    createdAt: Mapped[datetime] = mapped_column(DateTime)

