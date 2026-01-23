from django.contrib import admin
from django.urls import path, include 
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.authtoken.views import obtain_auth_token
from catalogo.views import CriptosViewSet, HistorialPrecioViewSet, CriptoListView, UserHistorialView, CustomTokenObtainPairView
from wallet.views import WalletViewSet, TransaccionViewSet, RegisterView, AdminTransaccionView, CrearTransaccionView

router = DefaultRouter()
router.register(r'criptos', CriptosViewSet, basename = 'cripto')
router.register(r'historialprecios', HistorialPrecioViewSet, basename = 'historialprecio')
router.register(r'wallets', WalletViewSet, basename='wallet')
router.register(r'transactions', TransaccionViewSet, basename='transaction')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/login/',obtain_auth_token, name='api_token_auth'), 
    path('api/register/', RegisterView.as_view(), name='register'),
    
    # 1. Rutas de Tokens (Login)
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),    
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 2. Conectar la app de Usuarios (Registro)
    # Esto hará que la url sea: /api/users/registro/
    path('api/users/', include('users.urls')), 

    # 3. Conectar la app de Billetera (Dashboard)
    # Esto hará que la url sea: /api/wallet/dashboard/
    path('api/wallet/', include('wallet.urls')),
    
    # 4. Ruta para que el usuario cree la operación
    path('api/transacciones/crear/', CrearTransaccionView.as_view(), name='crear-tx'),
    
    # GET: Lista pendientes
    path('api/admin/transacciones/', AdminTransaccionView.as_view(), name='admin-tx-list'),
    
    # POST: Aprobar/Rechazar una específica (pasamos el ID)
    path('api/admin/transacciones/<int:pk>/', AdminTransaccionView.as_view(), name='admin-tx-action'),
    
    path('api/criptos/', CriptoListView.as_view(), name='lista-criptos'),
    path('api/transacciones/historial/', UserHistorialView.as_view(), name='user-historial'),

]

