<template>
  <div class="code-playground">
    <div class="playground-header">
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>
      
      <div class="actions">
        <button 
          class="action-btn"
          @click="copyCode"
          :title="copied ? 'Скопійовано!' : 'Копіювати код'"
        >
          <span v-if="!copied">📋</span>
          <span v-else>✅</span>
        </button>
        
        <button 
          v-if="runnable"
          class="action-btn run-btn"
          @click="runCode"
          :disabled="running"
          title="Запустити код"
        >
          <span v-if="!running">▶️</span>
          <span v-else>⏳</span>
        </button>
      </div>
    </div>
    
    <div class="playground-content">
      <!-- Редактор коду -->
      <div v-if="activeTab === 'code'" class="code-editor">
        <div class="line-numbers">
          <div 
            v-for="n in lineCount" 
            :key="n" 
            class="line-number"
          >
            {{ n }}
          </div>
        </div>
        
        <textarea
          v-if="editable"
          v-model="editableCode"
          class="code-input"
          :placeholder="placeholder"
          @input="updateLineCount"
          spellcheck="false"
        ></textarea>
        
        <pre v-else class="code-display"><code v-html="highlightedCode"></code></pre>
      </div>
      
      <!-- Результат виконання -->
      <div v-if="activeTab === 'output'" class="output-panel">
        <div class="output-header">
          <span class="output-title">Результат виконання</span>
          <button 
            class="clear-btn"
            @click="clearOutput"
            title="Очистити вивід"
          >
            🗑️
          </button>
        </div>
        
        <div class="output-content">
          <div 
            v-for="(log, index) in outputLogs" 
            :key="index"
            :class="['log-entry', log.type]"
          >
            <span class="log-time">{{ log.time }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
          
          <div v-if="outputLogs.length === 0" class="empty-output">
            Запустіть код, щоб побачити результат
          </div>
        </div>
      </div>
      
      <!-- Пояснення -->
      <div v-if="activeTab === 'explanation'" class="explanation-panel">
        <div class="explanation-content">
          <h4>Пояснення коду:</h4>
          <div v-html="explanation"></div>
          
          <div v-if="relatedLinks.length > 0" class="related-links">
            <h5>Корисні посилання:</h5>
            <ul>
              <li v-for="link in relatedLinks" :key="link.url">
                <a :href="link.url" target="_blank">{{ link.title }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'javascript'
  },
  editable: {
    type: Boolean,
    default: false
  },
  runnable: {
    type: Boolean,
    default: false
  },
  explanation: {
    type: String,
    default: ''
  },
  relatedLinks: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Введіть ваш код тут...'
  }
})

const activeTab = ref('code')
const editableCode = ref(props.code)
const copied = ref(false)
const running = ref(false)
const outputLogs = ref([])

const tabs = computed(() => {
  const baseTabs = [
    { id: 'code', label: 'Код', icon: '💻' }
  ]
  
  if (props.runnable) {
    baseTabs.push({ id: 'output', label: 'Результат', icon: '📄' })
  }
  
  if (props.explanation) {
    baseTabs.push({ id: 'explanation', label: 'Пояснення', icon: '💡' })
  }
  
  return baseTabs
})

const lineCount = computed(() => {
  return editableCode.value.split('\n').length
})

const highlightedCode = computed(() => {
  // Простий syntax highlighting для JavaScript
  if (props.language === 'javascript') {
    return editableCode.value
      .replace(/\b(const|let|var|function|class|if|else|for|while|return|import|export|from|async|await)\b/g, '<span class="keyword">$1</span>')
      .replace(/\b(true|false|null|undefined)\b/g, '<span class="literal">$1</span>')
      .replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>')
      .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
      .replace(/\/\/.*$/gm, '<span class="comment">$&</span>')
      .replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>')
  }
  
  return editableCode.value
})

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(editableCode.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy code:', err)
  }
}

const runCode = async () => {
  if (!props.runnable) return
  
  running.value = true
  outputLogs.value = []
  
  try {
    // Симуляція виконання коду
    addLog('info', 'Запуск коду...')
    
    // Тут можна додати реальне виконання коду через Web Workers або інші методи
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Приклад виводу
    if (editableCode.value.includes('console.log')) {
      const matches = editableCode.value.match(/console\.log\(['"`]([^'"`]*)['"`]\)/g)
      if (matches) {
        matches.forEach(match => {
          const message = match.match(/['"`]([^'"`]*)['"`]/)[1]
          addLog('log', message)
        })
      }
    }
    
    addLog('success', 'Код виконано успішно!')
    
  } catch (error) {
    addLog('error', `Помилка: ${error.message}`)
  } finally {
    running.value = false
  }
}

const addLog = (type, message) => {
  const now = new Date()
  const time = now.toLocaleTimeString('uk-UA', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  })
  
  outputLogs.value.push({
    type,
    message,
    time
  })
}

const clearOutput = () => {
  outputLogs.value = []
}

const updateLineCount = () => {
  // Оновлення кількості рядків відбувається автоматично через computed
}

// Спостереження за змінами коду
watch(() => props.code, (newCode) => {
  editableCode.value = newCode
})

onMounted(() => {
  // Ініціалізація
})
</script>

<style scoped>
.code-playground {
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(65, 209, 255, 0.2);
  border-radius: 16px;
  overflow: hidden;
  margin: 2rem 0;
  backdrop-filter: blur(10px);
}

.playground-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(65, 209, 255, 0.1);
  border-bottom: 1px solid rgba(65, 209, 255, 0.2);
  padding: 0.5rem 1rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
}

.tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: var(--vp-c-text-2);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.tab:hover {
  background: rgba(65, 209, 255, 0.1);
  color: var(--vp-c-brand-1);
}

.tab.active {
  background: rgba(65, 209, 255, 0.2);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: rgba(65, 209, 255, 0.1);
  border: 1px solid rgba(65, 209, 255, 0.3);
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.action-btn:hover:not(:disabled) {
  background: rgba(65, 209, 255, 0.2);
  transform: translateY(-1px);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.run-btn {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

.run-btn:hover:not(:disabled) {
  background: rgba(34, 197, 94, 0.2);
}

.playground-content {
  min-height: 200px;
}

.code-editor {
  display: flex;
  position: relative;
}

.line-numbers {
  background: rgba(15, 23, 42, 0.8);
  padding: 1rem 0.5rem;
  border-right: 1px solid rgba(65, 209, 255, 0.1);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
  user-select: none;
  min-width: 3rem;
  text-align: right;
}

.line-number {
  line-height: 1.5;
}

.code-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #e2e8f0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  padding: 1rem;
  resize: none;
  outline: none;
  min-height: 200px;
}

.code-display {
  flex: 1;
  margin: 0;
  padding: 1rem;
  color: #e2e8f0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  overflow-x: auto;
}

/* Syntax highlighting */
:deep(.keyword) {
  color: #c792ea;
  font-weight: 600;
}

:deep(.literal) {
  color: #f78c6c;
}

:deep(.string) {
  color: #c3e88d;
}

:deep(.comment) {
  color: #546e7a;
  font-style: italic;
}

.output-panel {
  padding: 1rem;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(65, 209, 255, 0.1);
}

.output-title {
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.clear-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.clear-btn:hover {
  opacity: 1;
}

.output-content {
  max-height: 300px;
  overflow-y: auto;
}

.log-entry {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.25rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
}

.log-entry.info {
  background: rgba(65, 209, 255, 0.1);
  color: #41d1ff;
}

.log-entry.log {
  background: rgba(226, 232, 240, 0.1);
  color: #e2e8f0;
}

.log-entry.success {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.log-entry.error {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.log-time {
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
  min-width: 4rem;
}

.empty-output {
  text-align: center;
  color: var(--vp-c-text-3);
  font-style: italic;
  padding: 2rem;
}

.explanation-panel {
  padding: 1rem;
}

.explanation-content {
  color: var(--vp-c-text-1);
  line-height: 1.6;
}

.explanation-content h4 {
  color: var(--vp-c-brand-1);
  margin-bottom: 1rem;
}

.explanation-content h5 {
  color: var(--vp-c-brand-2);
  margin: 1.5rem 0 0.5rem 0;
}

.related-links ul {
  list-style: none;
  padding: 0;
}

.related-links li {
  margin-bottom: 0.5rem;
}

.related-links a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;
}

.related-links a:hover {
  border-bottom-color: var(--vp-c-brand-1);
}

/* Адаптивність */
@media (max-width: 768px) {
  .playground-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .tabs {
    justify-content: center;
  }
  
  .actions {
    justify-content: center;
  }
  
  .code-editor {
    flex-direction: column;
  }
  
  .line-numbers {
    display: none;
  }
}
</style>