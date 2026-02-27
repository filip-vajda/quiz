<template>
  <div class="leaderboard-page">
    <!-- Final reveal overlay -->
    <Transition name="fade">
      <LeaderboardFinalReveal v-if="quiz.display.revealMode" />
    </Transition>

    <!-- Waiting state -->
    <div v-if="!quiz.display.visible && !quiz.display.revealMode" class="waiting-state">
      <div class="waiting-content">
        <h1 class="waiting-title">Refresher Pub Quiz</h1>
        <p class="waiting-subtitle">Kvíz čoskoro začne...</p>
        <div class="waiting-dots">
          <span class="dot" />
          <span class="dot" />
          <span class="dot" />
        </div>
      </div>
    </div>

    <!-- Live leaderboard -->
    <div v-if="quiz.display.visible && !quiz.display.revealMode" class="live-state">
      <LeaderboardTable />
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Refresher Pub Quiz' })

const { quiz, init } = useQuizStore()
const { initChannel, listen, destroyChannel } = useBroadcastSync()

onMounted(() => {
  init()
  initChannel()
  listen()
})

onUnmounted(() => {
  destroyChannel()
})
</script>

<style scoped>
.leaderboard-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
}

.waiting-state {
  text-align: center;
}

.waiting-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.waiting-title {
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 800;
  color: var(--accent);
}

.waiting-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--text-muted);
}

.waiting-dots {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.3;
  animation: dot-pulse 1.4s infinite ease-in-out;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dot-pulse {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1.1); }
}

.live-state {
  width: 100%;
}
</style>
