<template>
  <UiBaseCard title="Ovládanie zobrazenia">
    <div class="controls">
      <div class="control-row">
        <span>Zobraziť rebríček</span>
        <button class="toggle" :class="{ active: quiz.display.visible }" @click="toggleVisibility">
          {{ quiz.display.visible ? 'ZAP' : 'VYP' }}
        </button>
      </div>

      <div class="divider" />

      <div class="reveal-section">
        <h4>Finálne odhalenie</h4>
        <p class="hint">Odhalí poradie od posledného miesta po prvé s animáciami.</p>

        <div v-if="!isRevealing" class="control-row">
          <UiBaseButton
            variant="primary"
            :disabled="quiz.teams.length < 2"
            @click="startReveal"
          >
            Spustiť odhalenie
          </UiBaseButton>
        </div>

        <div v-else class="reveal-controls">
          <div class="reveal-progress">
            Odhalené: {{ revealedCount }} / {{ totalTeams }}
          </div>
          <div class="reveal-buttons">
            <UiBaseButton variant="primary" small :disabled="isComplete" @click="revealNext">
              Ďalšie
            </UiBaseButton>
            <UiBaseButton variant="ghost" small :disabled="isComplete" @click="autoReveal()">
              Automaticky
            </UiBaseButton>
            <UiBaseButton variant="danger" small @click="exitReveal">
              Ukončiť
            </UiBaseButton>
          </div>
        </div>
      </div>

      <div class="divider" />

      <div class="data-section">
        <h4>Dáta</h4>
        <div class="data-buttons">
          <UiBaseButton variant="ghost" small @click="handleExport">
            Exportovať JSON
          </UiBaseButton>
          <UiBaseButton variant="ghost" small @click="triggerImport">
            Importovať JSON
          </UiBaseButton>
          <UiBaseButton variant="danger" small @click="handleReset">
            Resetovať kvíz
          </UiBaseButton>
        </div>
        <input
          ref="fileInput"
          type="file"
          accept=".json"
          style="display: none"
          @change="handleImport"
        />
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { exportQuiz, importQuiz as importQuizFile } from '~/utils/export'
import type { Quiz } from '~~/shared/types/quiz'

const { quiz, setDisplay, importQuizData, resetQuiz } = useQuizStore()
const { broadcast } = useBroadcastSync()
const { isRevealing, isComplete, revealedCount, totalTeams, startReveal, revealNext, autoReveal, exitReveal } = useFinalReveal()
const fileInput = ref<HTMLInputElement | null>(null)

function toggleVisibility() {
  setDisplay({ visible: !quiz.value.display.visible })
  broadcast()
}

function handleExport() {
  exportQuiz(quiz.value as Quiz)
}

function triggerImport() {
  fileInput.value?.click()
}

async function handleImport(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    const data = await importQuizFile(file)
    importQuizData(data)
    broadcast()
  }
  catch (e) {
    alert((e as Error).message)
  }
}

function handleReset() {
  if (confirm('Naozaj chceš resetovať celý kvíz? Všetky dáta budú vymazané.')) {
    resetQuiz()
    broadcast()
  }
}
</script>

<style scoped>
.controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.control-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.toggle {
  padding: 6px 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-input);
  color: var(--text-muted);
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition);
  min-width: 60px;
}

.toggle.active {
  background: var(--accent);
  color: #111;
  border-color: var(--accent);
}

.divider {
  height: 1px;
  background: var(--border);
}

h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.hint {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.reveal-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reveal-progress {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.reveal-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.data-section h4 {
  margin-bottom: 12px;
}

.data-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
