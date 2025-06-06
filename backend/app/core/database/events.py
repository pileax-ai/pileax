from sqlmodel import Session
from sqlalchemy import event
from datetime import datetime, UTC


@event.listens_for(Session, "before_flush")
def auto_update_modified_time(session, flush_context, instances):
    for obj in session.dirty:
        if hasattr(obj, "update_time"):
            try:
                setattr(obj, "update_time", datetime.now(UTC))
            except AttributeError:
                pass
