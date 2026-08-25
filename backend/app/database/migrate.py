from sqlalchemy import text
from app.database.database import engine


def migrate_database():
    with engine.begin() as conn:

        # -------------------------------------------------
        # Predictions table
        # -------------------------------------------------

        conn.execute(text("""
            ALTER TABLE predictions
            ADD COLUMN IF NOT EXISTS user_id INTEGER
            REFERENCES users(id)
        """))

        conn.execute(text("""
            ALTER TABLE predictions
            ADD COLUMN IF NOT EXISTS camera_id INTEGER
            REFERENCES cameras(id)
        """))

        conn.execute(text("""
            ALTER TABLE predictions
            ADD COLUMN IF NOT EXISTS authorized BOOLEAN
        """))

        conn.execute(text("""
            ALTER TABLE predictions
            ADD COLUMN IF NOT EXISTS siren BOOLEAN
            DEFAULT FALSE
            NOT NULL
        """))

        conn.execute(text("""
            ALTER TABLE predictions
            ADD COLUMN IF NOT EXISTS source VARCHAR(50)
            DEFAULT 'image'
            NOT NULL
        """))

        print("Database migration completed successfully.")