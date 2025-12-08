from sqlalchemy import or_, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.user_tab import UserTab
from app.schema.tab import TabCreate
from app.models.tab import Tab
from app.constants.genre import Genre
from app.constants.style import Style

async def get_tab_by_id(tab_id: int, session: AsyncSession) -> Tab:
    """
    Get a tab using the tab's id and return it
    """
    tab = await session.get(Tab, tab_id)
    return tab

async def increment_downloads(tab_id: int, session: AsyncSession):
    """
    Increment tab downloads by one
    """
    await session.execute(
        update(Tab)
        .where(Tab.id == tab_id)
        .values(downloads=Tab.downloads + 1)
    )
    await session.commit()

async def create_tab(tab_create: TabCreate, session: AsyncSession) -> Tab:
    """
    Create a tab and store in db
    """
    tab = Tab(**tab_create.model_dump())
    session.add(tab)
    await session.commit()
    await session.refresh(tab)
    return tab

async def get_tabs(
    session: AsyncSession,
    limit: int = 10,
    offset: int = 0
) -> list[Tab]:
    """
    Fetch tabs filtered by genre, with pagination.
    """
    query = (
        select(Tab)
        .offset(offset)
        .limit(limit)
    )
    result = await session.execute(query)
    tabs = result.scalars().all()
    return tabs

async def get_tabs_by_genre(
    genre: Genre,
    session: AsyncSession,
    limit: int = 10,
    offset: int = 0
) -> list[Tab]:
    """
    Fetch tabs filtered by genre, with pagination.
    """
    query = (
        select(Tab)
        .where(Tab.genre == genre)
        .offset(offset)
        .limit(limit)
    )
    result = await session.execute(query)
    tabs = result.scalars().all()
    return tabs

async def get_tabs_by_style(
    style: Style,
    session: AsyncSession,
    limit: int = 10,
    offset: int = 0
) -> list[Tab]:
    """
    Fetch tabs filtered by style, with pagination.
    """
    query = (
        select(Tab)
        .where(Tab.style == style)
        .offset(offset)
        .limit(limit)
    )
    result = await session.execute(query)
    tabs = result.scalars().all()
    return tabs

async def search_tabs(
    query: str,
    session: AsyncSession
) -> list[Tab]:
    """
    Fetch tabs from a search query that relates to either song_name, album, or artist
    """
    db_query = (
        select(Tab)
        .where(
            or_(
                Tab.song_name.ilike(f"%{query}%"),
                Tab.artist.ilike(f"%{query}%"),
                Tab.album.ilike(f"%{query}%")
            )
        )
        .limit(10)
    )
    result = await session.execute(db_query)
    tabs = result.scalars().all()
    return tabs

async def register_user_tab_download(user_id: int, tab_id: int, session: AsyncSession):
    existing = await session.execute(
        select(UserTab).where(
            UserTab.user_id == user_id,
            UserTab.tab_id == tab_id
        )
    )
    existing = existing.scalars().first()

    if not existing:
        session.add(UserTab(user_id=user_id, tab_id=tab_id))
        await increment_downloads(tab_id, session)

    await session.commit()
