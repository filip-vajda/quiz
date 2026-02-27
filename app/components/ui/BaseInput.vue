<template>
  <div class="base-input">
    <label v-if="label" class="base-input__label">{{ label }}</label>
    <input
      class="base-input__field"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string | number
  label?: string
  type?: string
  placeholder?: string
  min?: number
  max?: number
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.base-input__label {
  font-weight: 500;
  color: var(--text-muted);
}

.base-input__field {
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px 12px;
  font-family: inherit;
  color: var(--text);
  outline: none;
  transition: border-color var(--transition);
}

.base-input__field:focus {
  border-color: var(--accent);
}

.base-input__field::placeholder {
  color: var(--text-muted);
}
</style>
