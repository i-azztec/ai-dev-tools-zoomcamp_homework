from datetime import datetime

def execute_code(code: str, language: str) -> dict:
    start = datetime.now()
    dur = (datetime.now() - start).total_seconds()
    return {
        "output": "Execution is handled in the browser",
        "error": None,
        "executionTime": int(dur * 1000),
    }
