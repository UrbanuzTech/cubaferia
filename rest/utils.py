def get_model_by_name(name):
    from django.apps import apps
    system_apps = ['auth', 'rest']
    for app in system_apps:
        try:
            app_name = apps.get_model(app_label=app, model_name=name)
            if app_name:
                return app_name
        except LookupError:
            pass
