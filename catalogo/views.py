from django.shortcuts import render

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Criptos
from .serializers import CriptosSerializer
from .services import update_crypto_prices # Tu función de CoinMarketCap
from .serializers import HistorialPrecioSerializer
from .models import HistorialPrecio

class CriptosViewSet(viewsets.ModelViewSet):
    queryset = Criptos.objects.all()
    serializer_class = CriptosSerializer

    @action(detail=False, methods=['post'])
    def actualizar_precios(self, request):
        # Esta es la función que AJAX llamará silenciosamente
        update_crypto_prices() 
        return Response({'message': 'Precios actualizados en la DB'}, status=status.HTTP_200_OK)

class HistorialPrecioViewSet(viewsets.ReadOnlyModelViewSet):
   
    # queryset = HistorialPrecio.objects.all().order_by('fecha_registro')
    serializer_class = HistorialPrecioSerializer
    def get_queryset(self):
        queryset = HistorialPrecio.objects.all().order_by('fecha_registro')

        simbolo =   self.request.query_params.get('simbolo', None)
        if simbolo is not None:
            queryset = queryset.filter(cripto__simbolo = simbolo.upper())

        return queryset

