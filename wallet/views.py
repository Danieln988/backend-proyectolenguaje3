import openpyxl # Importamos la librería para Excel
from django.http import HttpResponse # Para devolver el archivo al navegador
from rest_framework.decorators import action # Para crear la ruta personalizada
from rest_framework import viewsets, permissions
from .models import Wallet, Transaccion
from decimal import Decimal
from .serializers import WalletSerializer, TransaccionSerializer
from rest_framework import generics
from .serializers import UserRegisterSerializer
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegisterSerializer

class WalletViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = WalletSerializer
    
    def get_queryset(self):
        # El usuario solo ve SUS billeteras, no las de otros
        return Wallet.objects.filter(user=self.request.user)

class TransaccionViewSet(viewsets.ModelViewSet):
    serializer_class = TransaccionSerializer

    def get_queryset(self):
        # 1. Filtramos por el usuario logueado
        queryset = Transaccion.objects.filter(user=self.request.user)
        
        # 2. Ordenamos: Lo más nuevo primero (-created_at)
        queryset = queryset.order_by('-created_at')

        # 3. (Opcional) Filtro extra: ?type=buy o ?type=sell
        tipo = self.request.query_params.get('type')
        if tipo:
            queryset = queryset.filter(type=tipo)

        return queryset

    def perform_create(self, serializer):
        # 1. Obtenemos la cripto y su precio actual
        cripto_seleccionada = serializer.validated_data['currency']
        precio_actual = cripto_seleccionada.preciousd
        
        # 2. LOGICA INTELIGENTE: ¿Qué nos envió el usuario?
        
        # OPCIÓN A: El usuario envió DÓLARES (amount_usd)
        # Usamos .get() para verificar si existe sin que dé error
        if serializer.validated_data.get('amount_usd'):
            monto_usd = serializer.validated_data['amount_usd']
            
            # Calculamos cuánta cripto le toca: Dólares / Precio
            cantidad_calculada = monto_usd / precio_actual
            
            # Guardamos calculando la Cripto
            serializer.save(
                user=self.request.user, 
                status='pending',
                amount_crypto=cantidad_calculada 
            )

        # OPCIÓN B: El usuario envió CRIPTO (amount_crypto) - La forma clásica
        elif serializer.validated_data.get('amount_crypto'):
            cantidad = serializer.validated_data['amount_crypto']
            
            # Calculamos cuánto es en Dólares: Cantidad * Precio
            total_calculado = cantidad * precio_actual
            
            # Guardamos calculando el USD
            serializer.save(
                user=self.request.user, 
                status='pending',
                amount_usd=total_calculado
            )

    # --- NUEVA FUNCIONALIDAD: EXPORTAR A EXCEL ---
    @action(detail=False, methods=['get'])
    def exportar_excel(self, request):
        # 1. Obtenemos los datos (reutilizando tu lógica de filtros y orden)
        transacciones = self.get_queryset()

        # 2. Creamos el libro de Excel y la hoja activa
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Historial de Transacciones"

        # 3. Definimos los encabezados de las columnas
        headers = ['ID', 'Fecha', 'Tipo', 'Moneda', 'Cantidad', 'Total USD', 'Estado']
        ws.append(headers)

        # 4. Iteramos sobre tus transacciones para llenar las filas
        for t in transacciones:
            # Formateamos la fecha para que se lea bien en Excel
            fecha_simple = t.created_at.strftime('%Y-%m-%d %H:%M:%S')
            
            fila = [
                t.id,
                fecha_simple,
                t.get_type_display(),   # Convierte 'buy' en "Compra" (según tu modelo)
                t.currency.simbolo,     # Accedemos al símbolo de la relación ForeignKey
                float(t.amount_crypto), # Convertimos a float para que Excel lo trate como número
                float(t.amount_usd),
                t.get_status_display()  # Convierte 'approved' en "Aprobado"
            ]
            ws.append(fila)

        # 5. Preparamos la respuesta HTTP tipo archivo
        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        # Esto le dice al navegador "Descarga este archivo con este nombre":
        response['Content-Disposition'] = 'attachment; filename="historial_transacciones.xlsx"'

        # 6. Guardamos el libro en la respuesta
        wb.save(response)
        return response