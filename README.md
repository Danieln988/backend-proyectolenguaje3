Lista de endpoints para el thunder client:

— Registro:
Metodo: POST
http://127.0.0.1:8000/api/register/

Body JSON:
{ "username": "...",
 "email": "...", 
 "password": "..." 
 }

— Login:
Metodo: POST
http://127.0.0.1:8000/api/login/
Body JSON:
{ "username": "...", 
"password": "..." 
}

BILLETERA Y TRANSACCIONES (acá requiere el token que te devuelve el LOGIN)

— Ver saldo:
Metodo: GET
http://127.0.0.1:8000/api/wallets/

— Comprar en USD:
Metodo: POST
http://127.0.0.1:8000/api/transactions/
Body JSON:
{ 
    "currency": 1,
    "type": "buy",
    "amount_usd": 100
}

Body JSON (Para comprar una cantidad especifica de criptos):
{
    "currency":1,
    "type": "buy",
    "amount_crypto": 0.5
}

— Vender:
Metodo: POST
http://127.0.0.1:8000/api/transactions/
Body JSON:
{ 
    "currency": 1, 
    "type": "sell", 
    "amount_usd": 50
}

Body JSON: (para vender un monto especifico de criptos)
{
  "currency": 1,
  "type": "sell",
  "amount_crypto": 0.05
}

— Historial:
Metodo: GET
http://127.0.0.1:8000/api/transactions/

— Descargar EXCEL:

Metodo: GET
http://127.0.0.1:8000/api/transactions/exportar_excel/
