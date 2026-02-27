<template>
  <UiBaseCard title="Skóre">
    <div v-if="quiz.teams.length === 0" class="empty">
      Najskôr pridaj tímy.
    </div>
    <div v-else class="score-grid-wrapper">
      <div class="round-tabs">
        <button
          v-for="round in quiz.roundCount"
          :key="round"
          class="round-tab"
          :class="{ active: activeRound === round }"
          @click="activeRound = round"
        >
          Kolo {{ round }}
        </button>
      </div>
      <div class="score-grid">
        <div v-for="team in quiz.teams" :key="team.id" class="score-row">
          <span class="score-team-name">{{ team.name }}</span>
          <input
            type="number"
            class="score-field"
            :value="getScore(team.id, activeRound - 1)"
            min="0"
            @change="handleScoreChange(team.id, activeRound - 1, $event)"
          />
        </div>
      </div>
      <div class="score-summary">
        <div class="summary-header">Celkové skóre</div>
        <div v-for="ranked in rankings" :key="ranked.team.id" class="summary-row">
          <span class="summary-rank">{{ ranked.rank }}.</span>
          <span class="summary-name">{{ ranked.team.name }}</span>
          <span class="summary-total">{{ ranked.total }}</span>
        </div>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
const { quiz, setScore } = useQuizStore()
const { rankings } = useLeaderboard()
const activeRound = ref(1)

function getScore(teamId: string, roundIndex: number): number {
  return quiz.value.scores[teamId]?.[roundIndex] || 0
}

function handleScoreChange(teamId: string, roundIndex: number, event: Event) {
  const value = Number((event.target as HTMLInputElement).value) || 0
  setScore(teamId, roundIndex, value)
}
</script>

<style scoped>
.empty {
  color: var(--text-muted);
}

.round-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.round-tab {
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: transparent;
  color: var(--text-muted);
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition);
}

.round-tab.active {
  background: var(--accent);
  color: #111;
  border-color: var(--accent);
}

.round-tab:hover:not(.active) {
  background: var(--bg-card-hover);
  color: var(--text);
}

.score-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.score-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.score-team-name {
  flex: 1;
  font-size: 0.9rem;
}

.score-field {
  width: 80px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 12px;
  font-family: inherit;
  color: var(--text);
  text-align: center;
  outline: none;
  transition: border-color var(--transition);
}

.score-field:focus {
  border-color: var(--accent);
}

.score-summary {
  border-top: 1px solid var(--border);
  padding-top: 16px;
}

.summary-header {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.summary-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  font-size: 0.9rem;
}

.summary-rank {
  width: 28px;
  font-weight: 700;
  color: var(--text-muted);
}

.summary-name {
  flex: 1;
}

.summary-total {
  font-weight: 700;
  color: var(--accent);
}
</style>
