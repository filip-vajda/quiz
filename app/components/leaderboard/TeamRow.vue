<template>
  <div class="team-row" :class="rankClass">
    <div class="rank-badge" :class="rankClass">
      {{ ranked.rank }}.
    </div>
    <div class="team-info">
      <span class="team-name">{{ ranked.team.name }}</span>
    </div>
    <div class="round-scores">
      <span
        v-for="(score, i) in ranked.roundScores"
        :key="i"
        class="round-score"
        :class="{ 'has-score': score > 0 }"
      >
        {{ score || '-' }}
      </span>
    </div>
    <div class="total-score">
      {{ ranked.total }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RankedTeam } from '~~/shared/types/quiz'

const props = defineProps<{ ranked: RankedTeam }>()

const rankClass = computed(() => {
  switch (props.ranked.rank) {
    case 1: return 'rank-gold'
    case 2: return 'rank-silver'
    case 3: return 'rank-bronze'
    default: return ''
  }
})
</script>

<style scoped>
.team-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition: all 0.3s ease;
}

.team-row.rank-gold {
  border-color: var(--gold);
  background: rgba(255, 215, 0, 0.05);
}

.team-row.rank-silver {
  border-color: var(--silver);
  background: rgba(192, 192, 192, 0.05);
}

.team-row.rank-bronze {
  border-color: var(--bronze);
  background: rgba(205, 127, 50, 0.05);
}

.rank-badge {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 800;
  font-size: clamp(1rem, 2vw, 1.3rem);
  background: var(--bg-input);
  color: var(--text-muted);
  flex-shrink: 0;
}

.rank-badge.rank-gold {
  background: var(--gold);
  color: #111;
}

.rank-badge.rank-silver {
  background: var(--silver);
  color: #111;
}

.rank-badge.rank-bronze {
  background: var(--bronze);
  color: #111;
}

.team-info {
  flex: 1;
  min-width: 0;
}

.team-name {
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.round-scores {
  display: flex;
  gap: 8px;
}

.round-score {
  width: 36px;
  text-align: center;
  font-size: clamp(0.75rem, 1.5vw, 0.9rem);
  color: var(--text-muted);
  font-weight: 500;
}

.round-score.has-score {
  color: var(--text);
}

.total-score {
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  font-weight: 800;
  color: var(--accent);
  min-width: 60px;
  text-align: right;
}
</style>
