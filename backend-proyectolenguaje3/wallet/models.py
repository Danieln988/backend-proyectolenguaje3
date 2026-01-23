import yagmail
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import models
from django.contrib.auth.models import User
from catalogo.models import Criptos

class Wallet(models.Model):
    # Almacena información sobre las billeteras de los usuarios, incluyendo el usuario, la criptomoneda y el saldo disponible.
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wallets')
    currency = models.ForeignKey(Criptos, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=30, decimal_places=18, default=0)

    class Meta:
        unique_together = ('user', 'currency')

class Transaccion(models.Model):
    # Almacena información sobre las transacciones realizadas por los usuarios, incluyendo el tipo de transacción, la cantidad de criptomonedas, el monto en USD y el estado de la transacción.
    TYPES = (('buy', 'Compra'), ('sell', 'Venta'))
    STATUS = (('pending', 'Pendiente'), ('approved', 'Aprobado'), ('rejected', 'Rechazado'))

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    currency = models.ForeignKey(Criptos, on_delete=models.CASCADE)
    type = models.CharField(max_length=4, choices=TYPES)
    amount_crypto = models.DecimalField(max_digits=30, decimal_places=18)
    amount_usd = models.DecimalField(max_digits=20, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.type} - {self.currency.simbolo}"
    


@receiver(post_save, sender=Transaccion)
def actualizar_saldo_wallet(sender, instance, created, **kwargs):
    # Solo actuamos si el status es 'approved'
    if instance.status == 'approved':
        # Buscamos o creamos la billetera
        wallet, _ = Wallet.objects.get_or_create(
            user=instance.user,
            currency=instance.currency
        )

        
        if instance.type == 'buy':
            wallet.balance += instance.amount_crypto
        elif instance.type == 'sell':
            # Verificamos que tenga saldo suficiente antes de restar (Seguridad extra)
            if wallet.balance >= instance.amount_crypto:
                wallet.balance -= instance.amount_crypto
            
        wallet.save()

        if instance.user.email:
            try:
                #acá configuras el correo, busca como crear una clave para aplicaciones en gmail y colocas tu dirección
                mi_correo = 'josedaniel0908@gmail.com'
                mi_password = 'shuv jsce bvhn eppc'

                yag = yagmail.SMTP(user=mi_correo, password=mi_password)

                asunto = f"Transacción aprobada {instance.get_type_display()}"

                contenido = [
                    f"Hola <b>{instance.user.username}</b>,",
                    "Tu transacción ha sido aprobada correctamente!",
                    f"<b>Tipo:</b> {instance.get_type_display()}",
                    f"<b>Moneda:</b> {instance.currency.simbolo}",
                    f"<b>Cantidad:</b> {instance.amount_crypto}",
                    f"<b>Total USD:</b> ${instance.amount_usd}",
                ]
                yag.send(to=instance.user.email, subject=asunto, contents=contenido)
                
                print("Se le notificó al usuario exitosamente por correo electronico.")

            except Exception as e:
                print(f"No se pudo enviar el correo de notificación. Error: {e}")