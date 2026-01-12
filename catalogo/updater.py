from apscheduler.schedulers.background import BackgroundScheduler
from .services import update_crypto_prices # Importa tu función existente

def start():
    scheduler = BackgroundScheduler()
    
    # Agregamos la tarea para que se ejecute cada 15 minutos
    scheduler.add_job(update_crypto_prices, 'interval', minutes=120)
    
    scheduler.start()