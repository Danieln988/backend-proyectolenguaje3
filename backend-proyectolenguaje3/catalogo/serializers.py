from rest_framework import serializers
from .models import Criptos
from .models import HistorialPrecio
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # 1. Genera los tokens normales (access y refresh)
        data = super().validate(attrs)

        # 2. Agrega los datos extra que quieras devolver
        # self.user es el usuario que está intentando loguearse
        data['id'] = self.user.id
        data['email'] = self.user.email
        data['username'] = self.user.username
        data['is_staff'] = self.user.is_staff  
        data['is_superuser'] = self.user.is_superuser

        return data
    
class CriptosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Criptos
        fields = ['id', 'nombrecripto', 'simbolo', 'preciousd']

class HistorialPrecioSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialPrecio
        fields = ['precio', 'fecha_registro']
        