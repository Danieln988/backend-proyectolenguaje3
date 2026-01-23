from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Criptos 
from wallet.models import Transaccion
from .serializers import CriptosSerializer, CustomTokenObtainPairSerializer, HistorialPrecioSerializer
from wallet.serializers import TransaccionAdminSerializer
from .services import update_crypto_prices # Tu función de CoinMarketCap
from .models import HistorialPrecio
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView

# 1. Vista para listar las monedas en el dropdown
class CriptoListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        criptos = Criptos.objects.all()
        serializer = CriptosSerializer(criptos, many=True)
        return Response(serializer.data)

# 2. Vista para ver MI historial (Solo las mías)
class UserHistorialView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # Filtramos por el usuario que hace la petición
        mis_transacciones = Transaccion.objects.filter(user=request.user).order_by('-created_at')
        serializer = TransaccionAdminSerializer(mis_transacciones, many=True)
        return Response(serializer.data)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

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

