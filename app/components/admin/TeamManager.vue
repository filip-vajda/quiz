<template>
  <UiBaseCard title="Tímy">
    <div class="team-list">
      <div v-for="team in quiz.teams" :key="team.id" class="team-item">
        <input
          class="team-name-input"
          :value="team.name"
          @change="updateTeamName(team.id, ($event.target as HTMLInputElement).value)"
        />
        <UiBaseButton variant="danger" small @click="removeTeam(team.id)">
          ✕
        </UiBaseButton>
      </div>
    </div>
    <div class="add-team">
      <input
        v-model="newTeamName"
        class="team-name-input"
        placeholder="Názov nového tímu"
        @keydown.enter="handleAdd"
      />
      <UiBaseButton variant="primary" small :disabled="!newTeamName.trim()" @click="handleAdd">
        Pridať
      </UiBaseButton>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
const { quiz, addTeam, updateTeamName, removeTeam } = useQuizStore()
const newTeamName = ref('')

function handleAdd() {
  if (!newTeamName.value.trim()) return
  addTeam(newTeamName.value)
  newTeamName.value = ''
}
</script>

<style scoped>
.team-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.team-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.team-name-input {
  flex: 1;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 12px;
  font-family: inherit;
  color: var(--text);
  outline: none;
  transition: border-color var(--transition);
}

.team-name-input:focus {
  border-color: var(--accent);
}

.team-name-input::placeholder {
  color: var(--text-muted);
}

.add-team {
  display: flex;
  gap: 8px;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid var(--border);
}
</style>
