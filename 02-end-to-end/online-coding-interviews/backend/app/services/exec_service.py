import subprocess
import tempfile
import os
from datetime import datetime

def execute_code(code: str, language: str) -> dict:
    start = datetime.now()
    try:
        if language == "javascript":
            result = _run_node(code)
        elif language == "python":
            result = _run_python(code)
        else:
            return {"output": "", "error": f"Unsupported language: {language}", "executionTime": 0}
        dur = (datetime.now() - start).total_seconds()
        return {"output": result["stdout"], "error": result["stderr"] or None, "executionTime": int(dur * 1000)}
    except Exception as e:
        dur = (datetime.now() - start).total_seconds()
        return {"output": "", "error": str(e), "executionTime": int(dur * 1000)}

def _run_node(code: str) -> dict:
    with tempfile.TemporaryDirectory() as tmp:
        path = os.path.join(tmp, "main.js")
        with open(path, "w", encoding="utf-8") as f:
            f.write(code)
        proc = subprocess.run(["node", path], capture_output=True, text=True, timeout=3)
        return {"stdout": proc.stdout, "stderr": proc.stderr}

def _run_python(code: str) -> dict:
    with tempfile.TemporaryDirectory() as tmp:
        path = os.path.join(tmp, "main.py")
        with open(path, "w", encoding="utf-8") as f:
            f.write(code)
        proc = subprocess.run(["python", path], capture_output=True, text=True, timeout=3)
        return {"stdout": proc.stdout, "stderr": proc.stderr}
