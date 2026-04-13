<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePyodide, detectEnvKeys } from '../composables/usePyodide'

const props = defineProps<{ code: string }>()

const { state, statusMessage, runCode } = usePyodide()

const editableCode = ref('')
const stdout = ref('')
const stderr = ref('')
const result = ref<string | null>(null)
const error = ref<string | null>(null)
const hasRun = ref(false)

// API Key management
const envKeys = ref<string[]>([])
const envValues = ref<Record<string, string>>({})

onMounted(() => {
  // Decode base64 code
  try {
    editableCode.value = atob(props.code)
  } catch {
    editableCode.value = props.code
  }

  // Detect required env keys
  envKeys.value = detectEnvKeys(editableCode.value)

  // Restore from sessionStorage
  for (const key of envKeys.value) {
    const saved = sessionStorage.getItem(`pyodide_env_${key}`)
    if (saved) envValues.value[key] = saved
  }
})

const hasOutput = computed(() => hasRun.value)
const isDisabled = computed(() => state.value === 'loading' || state.value === 'running')
const needsApiKeys = computed(() => envKeys.value.length > 0)

const buttonText = computed(() => {
  switch (state.value) {
    case 'loading': return statusMessage.value || 'Loading Python...'
    case 'running': return statusMessage.value || 'Running...'
    default: return '▶ Run'
  }
})

function updateEnvValue(key: string, value: string) {
  envValues.value[key] = value
  sessionStorage.setItem(`pyodide_env_${key}`, value)
}

async function handleRun() {
  if (isDisabled.value) return

  // Re-detect env keys from current code (user may have edited)
  envKeys.value = detectEnvKeys(editableCode.value)

  // Build env vars
  const vars: Record<string, string> = {}
  for (const key of envKeys.value) {
    if (envValues.value[key]) {
      vars[key] = envValues.value[key]
    }
  }

  hasRun.value = true
  stdout.value = ''
  stderr.value = ''
  result.value = null
  error.value = null

  const output = await runCode(editableCode.value, vars)
  stdout.value = output.stdout
  stderr.value = output.stderr
  result.value = output.result
  error.value = output.error
}

// Auto-resize textarea
function autoResize(e: Event) {
  const el = e.target as HTMLTextAreaElement
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}
</script>

<template>
  <div class="pyodide-runner">
    <div class="pyodide-header">
      <span class="pyodide-lang">Python</span>
      <span class="pyodide-badge">WASM</span>
    </div>

    <!-- API Key inputs -->
    <div v-if="needsApiKeys" class="pyodide-env">
      <div v-for="key in envKeys" :key="key" class="pyodide-env-row">
        <label :for="`env-${key}`" class="pyodide-env-label">{{ key }}</label>
        <input
          :id="`env-${key}`"
          type="password"
          :placeholder="`Enter ${key}`"
          :value="envValues[key] || ''"
          @input="updateEnvValue(key, ($event.target as HTMLInputElement).value)"
          class="pyodide-env-input"
          autocomplete="off"
        />
      </div>
      <div class="pyodide-env-hint">Stored in sessionStorage only. Cleared when you close this tab.</div>
    </div>

    <!-- Code editor -->
    <div class="pyodide-code-wrapper">
      <textarea
        v-model="editableCode"
        class="pyodide-code"
        spellcheck="false"
        @input="autoResize"
        :rows="editableCode.split('\n').length"
      />
    </div>

    <!-- Run button -->
    <div class="pyodide-actions">
      <button
        class="pyodide-run-btn"
        :class="{ 'is-running': isDisabled }"
        :disabled="isDisabled"
        @click="handleRun"
      >
        <span v-if="isDisabled" class="pyodide-spinner" />
        {{ buttonText }}
      </button>
    </div>

    <!-- Output -->
    <div v-if="hasOutput" class="pyodide-output">
      <pre v-if="stdout" class="pyodide-stdout">{{ stdout }}</pre>
      <pre v-if="stderr" class="pyodide-stderr">{{ stderr }}</pre>
      <pre v-if="error" class="pyodide-error">{{ error }}</pre>
      <pre v-if="result" class="pyodide-result">{{ result }}</pre>
      <div v-if="!stdout && !stderr && !error && !result && state !== 'loading' && state !== 'running'" class="pyodide-empty">
        (no output)
      </div>
    </div>
  </div>
</template>

<style scoped>
.pyodide-runner {
  margin: 16px 0;
  border: 1px solid rgba(var(--cosmic-accent-rgb, 139, 156, 247), 0.12);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg-alt);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15),
              0 0 40px rgba(var(--cosmic-accent-rgb, 139, 156, 247), 0.03);
}

.pyodide-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-bottom: 1px solid rgba(var(--cosmic-accent-rgb, 139, 156, 247), 0.08);
  background: rgba(var(--cosmic-accent-rgb, 139, 156, 247), 0.04);
}

.pyodide-lang {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pyodide-badge {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(var(--cosmic-accent-rgb, 139, 156, 247), 0.15);
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

/* API Key section */
.pyodide-env {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(var(--cosmic-accent-rgb, 139, 156, 247), 0.08);
  background: rgba(var(--cosmic-accent-rgb, 139, 156, 247), 0.02);
}

.pyodide-env-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.pyodide-env-label {
  font-size: 12px;
  font-family: 'Fira Code', 'Courier New', monospace;
  color: var(--vp-c-text-2);
  min-width: 160px;
  flex-shrink: 0;
}

.pyodide-env-input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid rgba(var(--cosmic-accent-rgb, 139, 156, 247), 0.15);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-family: 'Fira Code', 'Courier New', monospace;
  outline: none;
  transition: border-color 0.2s;
}

.pyodide-env-input:focus {
  border-color: var(--vp-c-brand-1);
}

.pyodide-env-hint {
  font-size: 11px;
  color: var(--vp-c-text-3);
  margin-top: 4px;
}

/* Code area */
.pyodide-code-wrapper {
  position: relative;
}

.pyodide-code {
  display: block;
  width: 100%;
  padding: 16px;
  margin: 0;
  border: none;
  background: var(--vp-code-bg);
  color: var(--vp-c-text-1);
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  tab-size: 4;
  resize: none;
  outline: none;
  overflow: hidden;
  min-height: 60px;
  box-sizing: border-box;
}

/* Actions bar */
.pyodide-actions {
  display: flex;
  justify-content: flex-end;
  padding: 8px 16px;
  border-top: 1px solid rgba(var(--cosmic-accent-rgb, 139, 156, 247), 0.08);
}

.pyodide-run-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 20px;
  border: 1px solid var(--vp-button-brand-border);
  border-radius: 6px;
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}

.pyodide-run-btn:hover:not(:disabled) {
  background: var(--vp-button-brand-hover-bg);
  border-color: var(--vp-button-brand-hover-border);
  box-shadow: 0 0 16px rgba(var(--cosmic-accent-rgb, 139, 156, 247), 0.15);
}

.pyodide-run-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.pyodide-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: pyodide-spin 0.6s linear infinite;
}

@keyframes pyodide-spin {
  to { transform: rotate(360deg); }
}

/* Output area */
.pyodide-output {
  padding: 12px 16px;
  border-top: 1px solid rgba(var(--cosmic-accent-rgb, 139, 156, 247), 0.08);
  background: rgba(0, 0, 0, 0.2);
  max-height: 400px;
  overflow-y: auto;
}

.pyodide-output pre {
  margin: 0;
  padding: 0;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
  background: none;
}

.pyodide-stdout {
  color: var(--vp-c-text-1);
}

.pyodide-stderr {
  color: #fb923c;
}

.pyodide-error {
  color: #f87171;
}

.pyodide-result {
  color: var(--vp-c-brand-1);
  opacity: 0.8;
}

.pyodide-empty {
  color: var(--vp-c-text-3);
  font-size: 13px;
  font-style: italic;
}

/* Dusk theme overrides */
:global(.dusk) .pyodide-runner {
  border-color: rgba(200, 134, 10, 0.12);
}

:global(.dusk) .pyodide-output {
  background: rgba(60, 52, 40, 0.08);
}
</style>
