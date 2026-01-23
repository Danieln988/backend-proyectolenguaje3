from django.contrib import admin
from .models import Wallet, Transaccion

@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    # Mostramos el usuario, la moneda y el saldo en la lista principal
    list_display = ('user', 'currency', 'balance')
    # Añadimos un filtro lateral para buscar por moneda o usuario
    list_filter = ('currency', 'user')

@admin.register(Transaccion)
class TransaccionAdmin(admin.ModelAdmin):
    # Columnas que verás en el listado de transacciones
    list_display = ('user', 'type', 'currency', 'amount_crypto', 'amount_usd', 'status', 'created_at')
    
    # Filtros laterales para que el admin gestione rápido
    list_filter = ('status', 'type', 'currency')
    
    # Esto permite al admin cambiar el estado (Aprobado/Rechazado) 
    # directamente desde la lista, sin entrar en cada transacción.
    list_editable = ('status',)
    
    # Barra de búsqueda por nombre de usuario
    search_fields = ('user__username',)