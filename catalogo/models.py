from django.db import models

# Create your models here.


class Criptos(models.Model):
    nombrecripto = models.CharField(max_length=50, verbose_name="Nombre")
    simbolo = models.CharField(max_length=10, unique=True, verbose_name="Símbolo (BTC, ETH,etc)")
    preciousd = models.DecimalField(max_digits=20, decimal_places=2, default=0.00)

    def __str__(self):
        return self.nombrecripto
    

class HistorialPrecio(models.Model):
    # Relaciona el historial con una cripto específica
    cripto = models.ForeignKey('Criptos', on_delete=models.CASCADE, related_name='historial')
    precio = models.DecimalField(max_digits=20, decimal_places=8)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.cripto.simbolo} - {self.precio} - {self.fecha_registro}"