import os
import sqlite3
from django.conf import settings

ENV_PATH = os.path.join(settings.BASE_DIR, '.env')

def is_installed():
    """
    Checks if system environment installation exists and INSTALLED=True.
    Returns False if .env is missing or INSTALLED is set to False.
    """
    if not os.path.exists(ENV_PATH):
        return False
    
    try:
        with open(ENV_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
            for line in content.splitlines():
                line = line.strip()
                if line.startswith('#') or not line:
                    continue
                if 'INSTALLED' in line:
                    key, _, val = line.partition('=')
                    if key.strip() == 'INSTALLED' and val.strip().strip('"\'').lower() == 'true':
                        return True
        return False
    except Exception:
        return False

def test_db_connection(engine, name, user, password, host, port):
    """
    Executes a real database socket connection test before saving configurations.
    Supports PostgreSQL, MySQL, and SQLite.
    """
    try:
        if engine == 'postgresql':
            try:
                import psycopg2
            except ImportError:
                return False, "psycopg2 library is not installed in virtual environment."
            
            conn = psycopg2.connect(
                dbname=name,
                user=user,
                password=password,
                host=host,
                port=int(port or 5432),
                connect_timeout=5
            )
            conn.close()
            return True, "PostgreSQL connection succeeded!"
            
        elif engine == 'mysql':
            try:
                import MySQLdb
            except ImportError:
                return False, "MySQLdb driver is not installed in virtual environment."

            conn = MySQLdb.connect(
                db=name,
                user=user,
                passwd=password,
                host=host,
                port=int(port or 3306),
                connect_timeout=5
            )
            conn.close()
            return True, "MySQL connection succeeded!"
            
        elif engine == 'sqlite3':
            db_file = os.path.join(settings.BASE_DIR, name or 'db.sqlite3')
            conn = sqlite3.connect(db_file)
            conn.close()
            return True, "SQLite connection succeeded!"
            
        return False, f"Unsupported database engine: '{engine}'"
        
    except Exception as e:
        return False, f"Database handshake failed: {str(e)}"

def write_env_file(db_engine, db_name, db_user, db_pass, db_host, db_port, site_name, site_url, cors_origin, secret_key):
    """
    Generates the production environment configuration file upon successful installer run.
    """
    site_name_clean = str(site_name or 'NewInfrizo').replace('"', '\\"')
    site_url_clean = str(site_url or 'http://127.0.0.1:8000').strip().rstrip('/')
    cors_origin_clean = str(cors_origin or 'http://localhost:3000').strip().rstrip('/')
    
    env_content = f"""# ==========================================
# NewInfrizo Environment Configuration
# Generated automatically by Installation Wizard
# ==========================================

# System Installation State
INSTALLED=True

# Security & Localization Settings
SECRET_KEY="{secret_key}"
DEBUG=True
TIME_ZONE="UTC"
LANGUAGE_CODE="en-us"

# Site Parameters
SITE_NAME="{site_name_clean}"
SITE_URL="{site_url_clean}"
CORS_ALLOWED_ORIGIN="{cors_origin_clean}"

# Database Configuration
DB_ENGINE="{db_engine}"
DB_NAME="{db_name}"
DB_USER="{db_user}"
DB_PASSWORD="{db_pass}"
DB_HOST="{db_host}"
DB_PORT="{db_port}"
"""
    with open(ENV_PATH, 'w', encoding='utf-8') as f:
        f.write(env_content)