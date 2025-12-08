from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint
from datetime import datetime, timezone

from app.db.base_class import Base

class UserTab(Base):
    __tablename__ = "user_tabs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    tab_id = Column(Integer, ForeignKey("tabs.id", ondelete="CASCADE"), nullable=False)
    downloaded_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    # Enforce uniqueness so users don’t store the same tab downloaded more than once
    __table_args__ = (
        UniqueConstraint("user_id", "tab_id", name="uq_user_tab"),
    )