import { ref } from 'vue'

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.29.3/full/'

// Pyodide built-in packages (no micropip needed)
const BUILTIN_PACKAGES = new Set([
  'numpy', 'pandas', 'scipy', 'matplotlib', 'scikit-learn', 'sklearn',
  'sympy', 'networkx', 'pillow', 'PIL', 'sqlite3', 'json', 're',
  'os', 'sys', 'math', 'random', 'datetime', 'collections', 'itertools',
  'functools', 'typing', 'pathlib', 'io', 'csv', 'hashlib', 'base64',
  'urllib', 'html', 'xml', 'unittest', 'dataclasses', 'enum', 'abc',
  'copy', 'pprint', 'textwrap', 'string', 'struct', 'decimal', 'fractions',
])

// Standard library modules (always available, skip install)
const STDLIB_MODULES = new Set([
  'os', 'sys', 'math', 'random', 'datetime', 'collections', 'itertools',
  'functools', 'typing', 'pathlib', 'io', 'csv', 'hashlib', 'base64',
  'urllib', 'html', 'xml', 'unittest', 'dataclasses', 'enum', 'abc',
  'copy', 'pprint', 'textwrap', 'string', 'struct', 'decimal', 'fractions',
  'json', 're', 'time', 'logging', 'traceback', 'inspect', 'operator',
  'contextlib', 'warnings', 'weakref', 'threading', 'queue', 'heapq',
  'bisect', 'array', 'statistics', 'secrets', 'uuid', 'tempfile',
  'shutil', 'glob', 'fnmatch', 'difflib', 'zipfile', 'gzip', 'bz2',
])

type PyodideState = 'idle' | 'loading' | 'ready' | 'running' | 'error'

interface RunResult {
  stdout: string
  stderr: string
  result: string | null
  error: string | null
}

// Module-level singleton
let pyodideInstance: any = null
let pyodidePromise: Promise<any> | null = null
const installedPackages = new Set<string>()

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(script)
  })
}

async function initPyodide(): Promise<any> {
  await loadScript(`${PYODIDE_CDN}pyodide.js`)
  const pyodide = await (window as any).loadPyodide({
    indexURL: PYODIDE_CDN,
  })
  await pyodide.loadPackage('micropip')
  return pyodide
}

function ensurePyodide(): Promise<any> {
  if (pyodideInstance) return Promise.resolve(pyodideInstance)
  if (!pyodidePromise) {
    pyodidePromise = initPyodide().then((py) => {
      pyodideInstance = py
      return py
    }).catch((err) => {
      pyodidePromise = null
      throw err
    })
  }
  return pyodidePromise
}

/** Extract top-level import module names from Python code */
export function detectImports(code: string): string[] {
  const modules = new Set<string>()
  // Match: import foo, import foo.bar, from foo import bar, from foo.bar import baz
  const importRe = /^(?:import\s+([\w.]+(?:\s*,\s*[\w.]+)*)|from\s+([\w.]+)\s+import)/gm
  let match
  while ((match = importRe.exec(code)) !== null) {
    if (match[1]) {
      // import foo, bar, baz
      match[1].split(',').forEach((m) => {
        const top = m.trim().split('.')[0]
        if (top) modules.add(top)
      })
    } else if (match[2]) {
      // from foo.bar import ...
      const top = match[2].split('.')[0]
      if (top) modules.add(top)
    }
  }
  return Array.from(modules)
}

/** Detect os.getenv("..._API_KEY") or os.environ["..._API_KEY"] patterns */
export function detectEnvKeys(code: string): string[] {
  const keys = new Set<string>()
  // os.getenv("KEY"), os.getenv('KEY'), os.environ["KEY"], os.environ['KEY'], os.environ.get("KEY")
  const re = /os\.(?:getenv|environ\.get)\s*\(\s*["']([^"']+)["']|os\.environ\s*\[\s*["']([^"']+)["']\s*\]/g
  let match
  while ((match = re.exec(code)) !== null) {
    const key = match[1] || match[2]
    if (key) keys.add(key)
  }
  return Array.from(keys)
}

export function usePyodide() {
  const state = ref<PyodideState>('idle')
  const loadError = ref<string | null>(null)
  const statusMessage = ref('')

  async function installPackages(packages: string[]): Promise<void> {
    const toInstall = packages.filter((p) => {
      const top = p.split('.')[0]
      return !STDLIB_MODULES.has(top) && !installedPackages.has(top)
    })
    if (toInstall.length === 0) return

    const py = await ensurePyodide()

    // Separate built-in Pyodide packages from micropip packages
    const builtinToLoad: string[] = []
    const micropipToInstall: string[] = []
    for (const pkg of toInstall) {
      if (BUILTIN_PACKAGES.has(pkg)) {
        builtinToLoad.push(pkg)
      } else {
        micropipToInstall.push(pkg)
      }
    }

    if (builtinToLoad.length > 0) {
      statusMessage.value = `Loading ${builtinToLoad.join(', ')}...`
      await py.loadPackage(builtinToLoad)
      builtinToLoad.forEach((p) => installedPackages.add(p))
    }

    if (micropipToInstall.length > 0) {
      statusMessage.value = `Installing ${micropipToInstall.join(', ')}...`
      const micropip = py.pyimport('micropip')
      await micropip.install(micropipToInstall)
      micropipToInstall.forEach((p) => installedPackages.add(p))
    }
  }

  async function setEnvVars(vars: Record<string, string>): Promise<void> {
    const py = await ensurePyodide()
    const entries = Object.entries(vars)
    if (entries.length === 0) return
    const setStatements = entries
      .map(([k, v]) => `os.environ["${k}"] = """${v}"""`)
      .join('\n')
    await py.runPythonAsync(`import os\n${setStatements}`)
  }

  async function runCode(code: string, envVars?: Record<string, string>): Promise<RunResult> {
    state.value = 'loading'
    loadError.value = null
    statusMessage.value = 'Loading Python runtime...'

    try {
      const py = await ensurePyodide()
      state.value = 'running'

      // Set env vars if provided
      if (envVars && Object.keys(envVars).length > 0) {
        await setEnvVars(envVars)
      }

      // Auto-detect and install packages
      const imports = detectImports(code)
      if (imports.length > 0) {
        await installPackages(imports)
      }

      statusMessage.value = 'Running...'

      // Capture stdout/stderr
      let stdout = ''
      let stderr = ''
      py.setStdout({ batched: (text: string) => { stdout += text + '\n' } })
      py.setStderr({ batched: (text: string) => { stderr += text + '\n' } })

      // Run code
      const rawResult = await py.runPythonAsync(code)

      // Convert result
      let result: string | null = null
      if (rawResult !== undefined && rawResult !== null) {
        try {
          result = String(rawResult)
          if (result === 'undefined' || result === 'None') result = null
        } catch {
          result = null
        }
      }

      state.value = 'ready'
      statusMessage.value = ''
      return {
        stdout: stdout.trimEnd(),
        stderr: stderr.trimEnd(),
        result,
        error: null,
      }
    } catch (err: any) {
      state.value = 'ready'
      statusMessage.value = ''

      // Extract Python traceback if available
      const errorMsg = err?.message || String(err)
      return {
        stdout: '',
        stderr: '',
        result: null,
        error: errorMsg,
      }
    }
  }

  return {
    state,
    loadError,
    statusMessage,
    runCode,
    installPackages,
  }
}
