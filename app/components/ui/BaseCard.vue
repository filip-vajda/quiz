<template>
  <div class="base-card">
    <h3 v-if="title" class="base-card__title">{{ title }}</h3>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<style scoped>
.base-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
}

.base-card__title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text);
}
</style>
