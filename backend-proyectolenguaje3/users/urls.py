from django.urls import path
from .views import registrar_usuario
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('registro/', registrar_usuario),
        
]

