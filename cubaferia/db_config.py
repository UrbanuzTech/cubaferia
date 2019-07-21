def get_database_config(id):
    return {
        'sqlite': {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': 'database.db'
            }
        },
        'postgres': {
            'default': {
                'ENGINE': 'django.db.backends.postgresql_psycopg2',
                'NAME': 'cubaferia',
                'HOST': 'localhost',
                'PORT': '5432',
                'USER': 'postgres',
                'PASSWORD': 'postgres'
            }
        }
    }[id]
