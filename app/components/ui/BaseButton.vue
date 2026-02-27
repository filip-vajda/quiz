<template>
  <button
    class="base-btn"
    :class="[`base-btn--${variant}`, { 'base-btn--small': small }]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'danger' | 'ghost'
  small?: boolean
  disabled?: boolean
}>()
</script>

<style scoped>
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition), opacity var(--transition);
}

.base-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-btn--primary {
  background: var(--accent);
  color: #111;
}

.base-btn--primary:hover:not(:disabled) {
  background: var(--accent-hover);
}

.base-btn--danger {
  background: var(--danger);
  color: #fff;
}

.base-btn--danger:hover:not(:disabled) {
  background: var(--danger-hover);
}

.base-btn--ghost {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border);
}

.base-btn--ghost:hover:not(:disabled) {
  background: var(--bg-card-hover);
  color: var(--text);
}

.base-btn--small {
  padding: 6px 12px;
  font-size: 0.8rem;
}
</style>
