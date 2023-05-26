
from datetime import datetime
import os


def create_dir(building_id: int) -> None:
    """
    Создает директории формата date_import/id/time#counter
    c автоинкрементом в случае единовременного создания
    каталога в рамках одной минуты
    """
    upload_dir = os.path.dirname(os.getcwd()) + '/upload_files'
    today = datetime.date(
        datetime.today()).strftime('%d-%m-%Y')
    current_time = datetime.now().strftime('%H_%M')
    full_path = os.path.join(
        upload_dir, today, str(building_id),  f'{current_time}')

    if (not os.path.exists(full_path)):
        os.makedirs(full_path)
    else:
        counter: int = 1
        while os.path.exists(full_path + f'#{counter}'):
            print('iter counter', counter)
            counter += 1
        os.makedirs(full_path + f'#{counter}')
