from django.urls import path
from wallet.views import obtener_dashboard

urlpatterns = [
    path('dashboard/', obtener_dashboard),
]