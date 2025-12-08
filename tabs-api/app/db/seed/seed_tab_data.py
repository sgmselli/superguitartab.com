import asyncio
import json
from sqlalchemy.future import select

from app.db.base import Tab
from app.db.session import AsyncSessionLocal
from app.utils.logging import Logger, LogLevel

async def seed_tabs_from_manifest(path: str = "./song_data.json"):
    """
    Seed the database with tabs from a local JSON manifest.
    """
    async with AsyncSessionLocal() as session:
        try:
            with open(path) as f:
                tabs = json.load(f)

            for t in tabs:
                result = await session.execute(
                    select(Tab).where(Tab.id == t["id"])
                )
                tab = result.scalars().first()
                if not tab:
                    session.add(Tab(**t))
                    Logger.log(LogLevel.INFO, f"Added song {t['song_name']} to database.")
                else:
                    # Update existing tab with new data
                    for key, value in t.items():
                        if hasattr(tab, key):
                            setattr(tab, key, value)
                    Logger.log(LogLevel.INFO, f"Updated song {t['song_name']} in database.")

                await session.commit()
        except Exception as e:
            await session.rollback()
            Logger.log(LogLevel.ERROR, f"Seeding failed: {e}")
        Logger.log(LogLevel.INFO, "Seeding complete.")


if __name__ == "__main__":
    asyncio.run(seed_tabs_from_manifest())