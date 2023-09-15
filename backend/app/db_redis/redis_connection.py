import redis.asyncio as redis
import hashlib


class RedisKeyGenerator:
    @staticmethod
    def path_generator(building_id: int, temp_file_name_id:str ) -> str:
        key_str = f"building_id/#{building_id}/temp_file_name/#{temp_file_name_id}"
        return key_str


redis_connect = redis.ConnectionPool()
redis_connect = redis.Redis(connection_pool=redis_connect)
