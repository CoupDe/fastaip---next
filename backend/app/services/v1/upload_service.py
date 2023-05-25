
from datetime import datetime
import os

# Создает директории с датой импорта


def create_dir() -> None:
    upload_dir = os.path.dirname(os.getcwd())+'/upload_files'
    today = datetime.date(
        datetime.today()).strftime('%d-%m-%Y')
    today_dir = os.path.join(upload_dir, today)

    if (not os.path.exists(upload_dir)):
        os.mkdir(upload_dir)
    if (not os.path.exists(today_dir)):
        os.mkdir(os.path.join(upload_dir, today))
