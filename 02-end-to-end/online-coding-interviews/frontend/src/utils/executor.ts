export interface ExecResult {
  output: string;
  error: string | null;
  executionTime: number;
}

type Pyodide = {
  runPythonAsync: (code: string) => Promise<unknown>;
};

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<Pyodide>;
  }
}

let pyodidePromise: Promise<Pyodide> | null = null;

async function ensurePyodide(): Promise<Pyodide> {
  if (!pyodidePromise) {
    pyodidePromise = new Promise((resolve, reject) => {
      try {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.0/full/pyodide.js';
        script.onload = () => {
          const loader = window.loadPyodide;
          if (!loader) {
            reject(new Error('Pyodide loader is not available'));
            return;
          }
          loader({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.0/full/' })
            .then((py) => resolve(py))
            .catch((err) => reject(err));
        };
        script.onerror = () => reject(new Error('Failed to load Pyodide'));
        document.head.appendChild(script);
      } catch (e) {
        reject(e);
      }
    });
  }
  return pyodidePromise;
}

async function runJavaScript(code: string): Promise<ExecResult> {
  const start = performance.now();
  try {
    const blob = new Blob([
      `self.onmessage = (e) => {\n` +
      `  const start = performance.now();\n` +
      `  let output = '';\n` +
      `  const origLog = console.log;\n` +
      `  console.log = (...args) => { output += args.join(' ') + "\n"; };\n` +
      `  try {\n` +
      `    const fn = new Function(e.data);\n` +
      `    const res = fn();\n` +
      `    if (res !== undefined) { output += String(res); }\n` +
      `    const dur = performance.now() - start;\n` +
      `    postMessage({ output, error: null, executionTime: Math.round(dur) });\n` +
      `  } catch (err) {\n` +
      `    const dur = performance.now() - start;\n` +
      `    postMessage({ output: '', error: String(err), executionTime: Math.round(dur) });\n` +
      `  } finally { console.log = origLog; }\n` +
      `};`
    ], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    return await new Promise<ExecResult>((resolve) => {
      worker.onmessage = (ev) => {
        worker.terminate();
        URL.revokeObjectURL(url);
        resolve(ev.data as ExecResult);
      };
      worker.postMessage(code);
    });
  } catch (e) {
    const dur = performance.now() - start;
    return { output: '', error: String(e), executionTime: Math.round(dur) };
  }
}

async function runPython(code: string): Promise<ExecResult> {
  const start = performance.now();
  try {
    const pyodide = await ensurePyodide();
    const b64 = btoa(unescape(encodeURIComponent(code)));
    const res = await pyodide.runPythonAsync(`
import sys
import io
import json
import base64

stdout_io = io.StringIO()
stderr_io = io.StringIO()

# Capture stdout/stderr
original_stdout = sys.stdout
original_stderr = sys.stderr
sys.stdout = stdout_io
sys.stderr = stderr_io

try:
    code_str = base64.b64decode("${b64}").decode("utf-8")
    # Execute in global scope
    exec(code_str, globals())
except Exception:
    import traceback
    traceback.print_exc()
finally:
    # Restore stdout/stderr
    sys.stdout = original_stdout
    sys.stderr = original_stderr

# Return JSON result
json.dumps({
    "stdout": stdout_io.getvalue(),
    "stderr": stderr_io.getvalue()
})
`);
    const dur = performance.now() - start;
    let out = '';
    let err = '';
    let jsRes: any = res as any;
    if (jsRes && typeof jsRes === 'object' && typeof jsRes.toJs === 'function') {
      jsRes = jsRes.toJs();
    }
    if (typeof jsRes === 'string') {
      try {
        const obj = JSON.parse(jsRes) as { stdout: string; stderr: string };
        out = obj.stdout || '';
        err = obj.stderr || '';
      } catch (_) {
        out = String(jsRes);
      }
    } else {
      out = String(jsRes ?? '');
    }
    return { output: out, error: err ? err : null, executionTime: Math.round(dur) };
  } catch (e) {
    const dur = performance.now() - start;
    return { output: '', error: String(e), executionTime: Math.round(dur) };
  }
}

export async function runCodeInBrowser(code: string, language: 'javascript' | 'python'): Promise<ExecResult> {
  if (language === 'python') {
    return await runPython(code);
  }
  return await runJavaScript(code);
}
