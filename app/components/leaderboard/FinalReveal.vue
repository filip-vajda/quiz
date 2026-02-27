<template>
  <div class="reveal-overlay">
    <div class="reveal-container">
      <h2 v-if="revealedCount === 0" class="reveal-title">
        Finálne výsledky
      </h2>

      <div class="reveal-list">
        <TransitionGroup name="leaderboard">
          <div
            v-for="(ranked, index) in revealedTeams"
            :key="ranked.team.id"
            class="reveal-row reveal-item"
            :class="[
              getGlowClass(ranked.rank),
              { 'is-latest': index === 0 },
            ]"
          >
            <div class="reveal-rank reveal-rank" :class="getGlowClass(ranked.rank)">
              {{ ranked.rank }}.
            </div>
            <div class="reveal-team-name">{{ ranked.team.name }}</div>
            <div class="reveal-score">{{ ranked.total }} b.</div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import confetti from 'canvas-confetti'

const { revealedTeams, revealedCount, currentRevealTeam } = useFinalReveal()

function getGlowClass(rank: number): string {
  switch (rank) {
    case 1: return 'glow-gold'
    case 2: return 'glow-silver'
    case 3: return 'glow-bronze'
    default: return ''
  }
}

// Fire confetti when 1st place is revealed
watch(currentRevealTeam, (team) => {
  if (team?.rank === 1) {
    fireConfetti()
  }
})

function fireConfetti() {
  const duration = 3000
  const end = Date.now() + duration

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#ffd700', '#00bfa5', '#fff'],
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#ffd700', '#00bfa5', '#fff'],
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }
  frame()
}
</script>

<style scoped>
.reveal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.reveal-container {
  width: 100%;
  max-width: 800px;
  padding: 40px;
}

.reveal-title {
  text-align: center;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: var(--accent);
  margin-bottom: 40px;
}

.reveal-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reveal-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.reveal-row.is-latest {
  transform: scale(1.02);
}

.reveal-rank {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 800;
  font-size: 1.3rem;
  background: var(--bg-input);
  color: var(--text-muted);
  flex-shrink: 0;
}

.reveal-rank.glow-gold {
  background: var(--gold);
  color: #111;
}

.reveal-rank.glow-silver {
  background: var(--silver);
  color: #111;
}

.reveal-rank.glow-bronze {
  background: var(--bronze);
  color: #111;
}

.reveal-row.glow-gold {
  border-color: var(--gold);
}

.reveal-row.glow-silver {
  border-color: var(--silver);
}

.reveal-row.glow-bronze {
  border-color: var(--bronze);
}

.reveal-team-name {
  flex: 1;
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  font-weight: 700;
}

.reveal-score {
  font-size: clamp(1.3rem, 3vw, 2rem);
  font-weight: 800;
  color: var(--accent);
}
</style>
