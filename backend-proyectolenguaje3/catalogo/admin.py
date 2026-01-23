from django.contrib import admin
from .models import Criptos

@admin.register(Criptos)
class CriptosAdmin(admin.ModelAdmin):

    list_display = ('simbolo', 'nombrecripto', 'preciousd') 
    search_fields = ('simbolo', 'nombrecripto')