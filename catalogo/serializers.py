from rest_framework import serializers
from .models import Criptos
from .models import HistorialPrecio
class CriptosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Criptos
        fields = ['id', 'nombrecripto', 'simbolo', 'preciousd']

class HistorialPrecioSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialPrecio
        fields = ['precio', 'fecha_registro']
        