<template>
  <div class="history-page">
    <header class="history-header">
      <NuxtLink to="/admin" class="back-link">&larr; Späť</NuxtLink>
      <h1>História kvízov</h1>
    </header>

    <div v-if="loading" class="loading">Načítavam...</div>

    <div v-else-if="items.length === 0" class="empty">
      <p>Zatiaľ žiadne kvízy.</p>
    </div>

    <div v-else class="quiz-list">
      <div v-for="q in items" :key="q.id" class="quiz-card">
        <div class="quiz-card-info">
          <h3 class="quiz-card-name">{{ q.name }}</h3>
          <div class="quiz-card-meta">
            <span>{{ formatDate(q.createdAt) }}</span>
            <span>{{ q.teamCount }} tímov</span>
            <span v-if="q.winner" class="winner">Víťaz: {{ q.winner }}</span>
          </div>
        </div>
        <div class="quiz-card-actions">
          <UiBaseButton variant="primary" small @click="openQuiz(q.id)">
            Otvoriť
          </UiBaseButton>
          <UiBaseButton variant="danger" small @click="handleDelete(q.id)">
            Zmazať
          </UiBaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'História | Refresher Pub Quiz' })

const router = useRouter()
const { items, loading, fetchAll, deleteQuiz } = useQuizHistory()

onMounted(() => {
  fetchAll()
})

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('sk-SK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function openQuiz(id: string) {
  router.push({ path: '/admin', query: { quiz: id } })
}

async function handleDelete(id: string) {
  if (!confirm('Naozaj chceš zmazať tento kvíz?')) return
  await deleteQuiz(id)
}
</script>

<style scoped>
.history-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 24px 16px 60px;
}

.history-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.history-header h1 {
  font-size: 1.3rem;
  font-weight: 800;
}

.back-link {
  color: var(--accent);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
}

.back-link:hover {
  text-decoration: underline;
}

.loading,
.empty {
  text-align: center;
  color: var(--text-muted);
  padding: 40px 0;
}

.quiz-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quiz-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.quiz-card-name {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.quiz-card-meta {
  display: flex;
  gap: 12px;
  font-size: 0.8rem;
  color: var(--text-muted);
  flex-wrap: wrap;
}

.winner {
  color: var(--accent);
  font-weight: 600;
}

.quiz-card-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
</style>
