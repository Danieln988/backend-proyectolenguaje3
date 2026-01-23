from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

# --- VISTA DE REGISTRO ---
@api_view(['POST'])
@permission_classes([AllowAny]) # Permitir entrar a cualquiera (para registrarse)
def registrar_usuario(request):
    data = request.data
    try:
        user = User.objects.create(
            username=data['email'], # Usamos el email como username
            email=data['email'],
            password=make_password(data['password']), # Encriptar contraseña
            first_name=data.get('nombre', '')
        )
        return Response({'mensaje': 'Usuario creado exitosamente'}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

# --- VISTA PROTEGIDA (DASHBOARD) ---
@api_view(['GET'])
@permission_classes([IsAuthenticated]) # <--- ¡SOLO CON TOKEN!
def obtener_dashboard(request):
    user = request.user
    # Aquí simulamos datos, pero en el futuro los sacarás de tus modelos
    datos_portafolio = {
        "usuario": user.first_name,
        "balance_total": 15400.00,
        "activos": [
            {"nombre": "Bitcoin", "simbolo": "BTC", "cantidad": 0.5, "valor": 22000, "color": "bg-orange-500"},
            {"nombre": "USDT", "simbolo": "USDT", "cantidad": 400, "valor": 400, "color": "bg-emerald-500"},
        ]
    }
    return Response(datos_portafolio)

# Create your views here.
