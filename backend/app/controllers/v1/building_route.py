from fastapi import APIRouter

route = APIRouter(prefix='/v1/buildings', tags=['buildings'])


@route.get('/')
def read_all_building():
    pass


@route.get('/{building_id}')
def read_building():
    pass


@route.post('/{building_id}')
def create_building():
    pass


@route.patch('/{building_id}')
def update_building():
    pass


@route.delete('/{building_id}')
def delete_buildings():
    pass
