import redis.asyncio as redis
import hashlib


class RedisKeyGenerator:
    @staticmethod
    def path_generator(building_id: int, temp_base_folder: str) -> bytes:
        key_str = f"building_id/{building_id}/temp_import_path/:{temp_base_folder}"
        return key_str.encode("utf-8")


redis_connect = redis.Redis()
