import requests
from django.conf import settings
from .models import Criptos, HistorialPrecio # Importamos ambos modelos

def update_crypto_prices():
    url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'
    parameters = {
        'symbol': 'BTC,ETH,DOGE,USDT,XRP', # Puedes agregar más monedas separadas por coma: 'BTC,ETH,BNB'
        'convert': 'USD'
    }
    headers = {
        'X-CMC_PRO_API_KEY': '9cc7d5f4f6e645499ee3f351fdca244e',
        'Accepts': 'application/json',
    }

    try:
        response = requests.get(url, params=parameters, headers=headers)
        data = response.json()

        # Iteramos sobre los símbolos definidos en los parámetros
        for symbol in parameters['symbol'].split(','):
            try:
                # Extraemos el precio desde la respuesta de CoinMarketCap
                precio_actual = data['data'][symbol]['quote']['USD']['price']
                
                # 1. Buscamos el objeto de la criptomoneda en la base de datos
                cripto_obj = Criptos.objects.get(simbolo=symbol)
                
                # 2. Actualizamos el precio actual en el catálogo (lo que ya hacías)
                cripto_obj.preciousd = precio_actual
                cripto_obj.save()
                
                # 3. CREAMOS el registro histórico (Puntos para la gráfica)
                # Esto guarda una "foto" del precio y la fecha/hora exacta
                HistorialPrecio.objects.create(
                    cripto=cripto_obj, 
                    precio=precio_actual
                )
                
                print(f"Actualizado: {symbol} a {precio_actual}")

            except Criptos.DoesNotExist:
                print(f"La cripto {symbol} no existe en la base de datos.")
                continue
            except KeyError:
                print(f"No se encontraron datos para {symbol} en la API.")
                continue

        
        print("Precios actualizados correctamente.")
                
    except Exception as e:
        print(f"Error de conexión con la API: {e}")