<template>
  <div class="leaderboard">
    <div v-if="quiz.name" class="leaderboard-header">
      <h1 class="quiz-title">{{ quiz.name }}</h1>
    </div>
    <TransitionGroup name="leaderboard" tag="div" class="leaderboard-list">
      <LeaderboardTeamRow
        v-for="ranked in rankings"
        :key="ranked.team.id"
        :ranked="ranked"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
const { quiz } = useQuizStore()
const { rankings } = useLeaderboard()
</script>

<style scoped>
.leaderboard {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.leaderboard-header {
  text-align: center;
  margin-bottom: 32px;
}

.quiz-title {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 800;
  color: var(--text);
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}
</style>
