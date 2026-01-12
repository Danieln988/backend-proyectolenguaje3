from rest_framework import serializers
from .models import Wallet, Transaccion
from decimal import Decimal
from django.contrib.auth.models import User
#registro de user
class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class WalletSerializer(serializers.ModelSerializer):
    currency_simbolo = serializers.CharField(source='currency.simbolo', read_only=True)
    
    class Meta:
        model = Wallet
        fields = ['id', 'currency', 'currency_simbolo', 'balance']

class TransaccionSerializer(serializers.ModelSerializer):
    currency_simbolo = serializers.CharField(source='currency.simbolo', read_only=True)

    class Meta:
        model = Transaccion
        fields = '__all__'
        read_only_fields = ['user', 'status', 'created_at']

        extra_kwargs= {
            'amount_usd':{'required': False},
            'amount_crypto':{'required': False}
        }
    def validate(self, data):
        user = self.context['request'].user
        #aca estoy validando que el usuario haya ingresado al menos un monto
        if not data.get('amount_crypto') and not data.get('amount_usd'):
            raise serializers.ValidationError(
                "Error, no has proporcionado ningún valor en cripto o en USD."
            )
        # Validación adicional para ventas
        if data['type'] == 'sell':
            currency_a_vender = data['currency']
            
            cantidad_a_validar = Decimal(0)

            if data.get('amount_crypto'):
                cantidad_a_validar = data['amount_crypto']
            elif data.get('amount_usd'):
                cantidad_a_validar = Decimal(data['amount_usd']) / currency_a_vender.preciousd

            try:
                wallet = Wallet.objects.get(user=user, currency=currency_a_vender)

                if wallet.balance < cantidad_a_validar:
                    raise serializers.ValidationError(
                        {"error": f"Tu saldo es insuficiente. Tu saldo actual es: {wallet.balance} {currency_a_vender.simbolo}, pero intentas vender {cantidad_a_validar:.8f}"}
                    )
            except Wallet.DoesNotExist:
                raise serializers.ValidationError(
                    {"error": "No tienes saldo de esta criptomoneda para vender."}
                )
        return data