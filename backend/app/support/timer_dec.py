import time
from colorama import init, Fore


def timer_async(func):
    async def wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        await func(*args, **kwargs)
        end_time = time.perf_counter()
        elapsed_time = end_time - start_time
        print(
            f"Function ******{Fore.CYAN}{func.__name__}{Fore.RESET}@@******* took {Fore.YELLOW}{elapsed_time:.4f}{Fore.RESET} seconds to run."
        )

    return wrapper
