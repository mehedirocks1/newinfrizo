import os
import secrets
import json
from dotenv import load_dotenv
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.management import call_command
from django.contrib.auth.models import User
from django.conf import settings
from django.db import connections

from .utils import is_installed, test_db_connection, write_env_file, ENV_PATH

def install_page(request):
    """Renders the HTML installer interface."""
    if is_installed():
        return render(request, 'installer/already_installed.html')
    return render(request, 'installer/wizard.html')

@csrf_exempt
def api_test_db(request):
    """API endpoint to validate DB details before proceeding."""
    if request.method != 'POST':
        return JsonResponse({'error': 'POST method required'}, status=405)
    
    try:
        data = json.loads(request.body)
    except Exception:
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)

    engine = data.get('engine', 'sqlite3')
    name = data.get('name', 'db.sqlite3')
    user = data.get('user', '')
    password = data.get('password', '')
    host = data.get('host', 'localhost')
    port = data.get('port', '')

    success, message = test_db_connection(engine, name, user, password, host, port)
    return JsonResponse({'success': success, 'message': message})

def configure_runtime_database(db_engine, db_name, db_user, db_pass, db_host, db_port):
    """
    Safely builds a fully compliant Django database settings dictionary including all
    mandatory keys (OPTIONS, TIME_ZONE, AUTOCOMMIT, CONN_MAX_AGE, TEST) to prevent KeyError.
    """
    tz = getattr(settings, 'TIME_ZONE', 'UTC') or 'UTC'

    if db_engine == 'postgresql':
        db_config = {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': db_name or 'newinfrizo_db',
            'USER': db_user or 'postgres',
            'PASSWORD': db_pass or '',
            'HOST': db_host or 'localhost',
            'PORT': str(db_port or 5432),
            'OPTIONS': {},
            'TIME_ZONE': tz,
            'ATOMIC_REQUESTS': False,
            'AUTOCOMMIT': True,
            'CONN_MAX_AGE': 0,
            'CONN_HEALTH_CHECKS': False,
            'TEST': {'CHARSET': None, 'COLLATION': None, 'MIGRATE': True, 'MIRROR': None, 'NAME': None},
        }
    elif db_engine == 'mysql':
        db_config = {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': db_name or 'newinfrizo_db',
            'USER': db_user or 'root',
            'PASSWORD': db_pass or '',
            'HOST': db_host or 'localhost',
            'PORT': str(db_port or 3306),
            'OPTIONS': {'init_command': "SET sql_mode='STRICT_TRANS_TABLES'"},
            'TIME_ZONE': tz,
            'ATOMIC_REQUESTS': False,
            'AUTOCOMMIT': True,
            'CONN_MAX_AGE': 0,
            'CONN_HEALTH_CHECKS': False,
            'TEST': {'CHARSET': None, 'COLLATION': None, 'MIGRATE': True, 'MIRROR': None, 'NAME': None},
        }
    else:
        db_file = os.path.join(settings.BASE_DIR, db_name or 'db.sqlite3')
        db_config = {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': db_file,
            'USER': '',
            'PASSWORD': '',
            'HOST': '',
            'PORT': '',
            'OPTIONS': {},
            'TIME_ZONE': tz,
            'ATOMIC_REQUESTS': False,
            'AUTOCOMMIT': True,
            'CONN_MAX_AGE': 0,
            'CONN_HEALTH_CHECKS': False,
            'TEST': {'CHARSET': None, 'COLLATION': None, 'MIGRATE': True, 'MIRROR': None, 'NAME': None},
        }

    # 1. Update settings.DATABASES['default']
    settings.DATABASES['default'] = db_config

    # 2. Purge old connection wrapper from Django's connection handler
    if 'default' in connections:
        try:
            connections['default'].close()
        except Exception:
            pass
        del connections['default']

@csrf_exempt
def api_run_installation(request):
    """API endpoint to complete setup, save .env, run migrations, and create admin user."""
    if request.method != 'POST':
        return JsonResponse({'error': 'POST method required'}, status=405)

    if is_installed():
        return JsonResponse({'error': 'System is already installed.'}, status=400)

    try:
        data = json.loads(request.body)
    except Exception:
        return JsonResponse({'error': 'Invalid JSON payload'}, status=400)

    db_engine = data.get('engine', 'sqlite3')
    db_name = data.get('name', 'db.sqlite3')
    db_user = data.get('user', '')
    db_pass = data.get('password', '')
    db_host = data.get('host', 'localhost')
    db_port = data.get('port', '5432' if db_engine == 'postgresql' else ('3306' if db_engine == 'mysql' else ''))

    site_name = data.get('site_name', 'NewInfrizo')
    site_url = data.get('site_url', 'http://127.0.0.1:8000')
    cors_origin = data.get('cors_origin', 'http://localhost:3000')

    admin_username = data.get('admin_username')
    admin_email = data.get('admin_email')
    admin_password = data.get('admin_password')

    # 1. Test database connection socket
    success, message = test_db_connection(db_engine, db_name, db_user, db_pass, db_host, db_port)
    if not success:
        return JsonResponse({'error': f"Database connection failed: {message}"}, status=400)

    # 2. Configure runtime database dictionary with complete keys
    configure_runtime_database(db_engine, db_name, db_user, db_pass, db_host, db_port)

    # 3. Save .env configuration file
    secret_key = secrets.token_urlsafe(50)
    write_env_file(db_engine, db_name, db_user, db_pass, db_host, db_port, site_name, site_url, cors_origin, secret_key)
    load_dotenv(ENV_PATH, override=True)

    # 4. Apply Migrations & Create/Update Admin User & SiteConfig
    try:
        call_command('migrate', interactive=False)
        
        if admin_username and admin_password:
            user, created = User.objects.get_or_create(
                username=admin_username,
                defaults={'email': admin_email or 'admin@example.com'}
            )
            user.set_password(admin_password)
            user.email = admin_email or user.email
            user.is_staff = True
            user.is_superuser = True
            user.save()

        from apps.core.models import SiteConfiguration
        site_config, _ = SiteConfiguration.objects.get_or_create(id=1)
        if site_name:
            site_config.site_name = site_name
            site_config.save()

        return JsonResponse({'success': True, 'message': 'Installation completed successfully!'})

    except Exception as e:
        return JsonResponse({'error': f"Setup failed during execution: {str(e)}"}, status=500)

@csrf_exempt
def api_reset_installation(request):
    """Resets installation state by removing INSTALLED=True flag."""
    if os.path.exists(ENV_PATH):
        try:
            os.remove(ENV_PATH)
        except Exception:
            pass
    return JsonResponse({'success': True, 'message': 'Installation state reset. You can now re-run setup.'})