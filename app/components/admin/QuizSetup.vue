<template>
  <UiBaseCard title="Nastavenie kvízu">
    <div class="setup-grid">
      <UiBaseInput
        label="Názov kvízu"
        :model-value="quiz.name"
        placeholder="napr. Refresher Pub Quiz #42"
        @update:model-value="setQuizName($event)"
      />
      <UiBaseInput
        label="Počet kôl"
        type="number"
        :model-value="String(quiz.roundCount)"
        :min="1"
        :max="20"
        @update:model-value="setRoundCount(Number($event) || 1)"
      />
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
const { quiz, setQuizName, setRoundCount } = useQuizStore()
</script>

<style scoped>
.setup-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  align-items: end;
}

.setup-grid :deep(.base-input:last-child .base-input__field) {
  width: 80px;
  text-align: center;
}
</style>
