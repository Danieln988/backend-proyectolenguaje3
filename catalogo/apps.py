from django.apps import AppConfig
import os

class CatalogoConfig(AppConfig):
    name = 'catalogo'


    def ready(self):
        if os.environ.get('RUN_MAIN', None) == 'true':
            from . import updater
            updater.start()