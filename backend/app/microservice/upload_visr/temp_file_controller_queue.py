import asyncio
import json

from redis import Redis  # type: ignore


class TempFileTaskManager:
    def __init__(self) -> None:
        self.tasks: dict[str, asyncio.Task] = {}
        self.redis_task_key: str | None = None

    async def add_task(
        self, base_folder: str, task: asyncio.Task, redis_connect: Redis
    ):
        self.tasks[base_folder] = task
        await self.save_task_to_redis(base_folder, redis_connect)

    def cancel_task(self, base_folder: str):
        task = self.tasks.get(base_folder)
        if task:
            task.cancel()
            self.tasks.pop(base_folder)

    async def save_task_to_redis(self, building: str, redis_connect: Redis):
        self.redis_task_key = f"{building}#tasks"
        assert self.redis_task_key is not None
        key, _ = list(self.tasks.items())[0]
        await redis_connect.set(self.redis_task_key, key)
