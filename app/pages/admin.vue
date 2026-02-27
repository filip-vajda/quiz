<template>
  <div class="admin-page">
    <header class="admin-header">
      <h1>Refresher Pub Quiz</h1>
      <span class="admin-badge">Admin</span>
    </header>
    <div class="admin-grid">
      <AdminQuizSetup />
      <AdminTeamManager />
      <AdminScoreInput />
      <AdminDisplayControls />
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Admin | Refresher Pub Quiz' })

const { init, quiz } = useQuizStore()
const { initChannel, broadcast, destroyChannel } = useBroadcastSync()

onMounted(() => {
  init()
  initChannel()
})

onUnmounted(() => {
  destroyChannel()
})

// Broadcast on every quiz change from admin
watch(
  () => JSON.stringify(quiz.value),
  () => {
    broadcast()
  },
)
</script>

<style scoped>
.admin-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 24px 16px 60px;
}

.admin-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.admin-header h1 {
  font-size: 1.3rem;
  font-weight: 800;
}

.admin-badge {
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--accent);
  color: #111;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.admin-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
