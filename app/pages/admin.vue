<template>
  <div class="admin-page">
    <header class="admin-header">
      <h1>Refresher Pub Quiz</h1>
      <span class="admin-badge">Admin</span>
      <div class="header-actions">
        <UiBaseButton variant="ghost" small @click="handleNewQuiz">
          Nový kvíz
        </UiBaseButton>
        <NuxtLink to="/history" class="history-link">
          História
        </NuxtLink>
      </div>
    </header>

    <div v-if="quiz.id" class="quiz-link-bar">
      <span class="quiz-link-label">Leaderboard link:</span>
      <code class="quiz-link-url">{{ leaderboardUrl }}</code>
      <UiBaseButton variant="ghost" small @click="copyLink">
        {{ copied ? 'Skopírované!' : 'Kopírovať' }}
      </UiBaseButton>
    </div>

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

const route = useRoute()
const router = useRouter()
const { init, quiz, loadFromRemote, createNewQuiz } = useQuizStore()
const { push, subscribe, unsubscribe } = useSupabaseSync()

const copied = ref(false)

const leaderboardUrl = computed(() => {
  const origin = import.meta.client ? window.location.origin : ''
  return `${origin}/?quiz=${quiz.value.id}`
})

onMounted(async () => {
  const quizId = route.query.quiz as string | undefined

  if (quizId) {
    init(quizId)
    // Try loading from Supabase if localStorage didn't have it
    if (quiz.value.id !== quizId) {
      await loadFromRemote(quizId)
    }
  } else {
    init()
    // If we have a quiz from localStorage, ensure URL has the quiz ID
    if (quiz.value.id) {
      router.replace({ query: { quiz: quiz.value.id } })
    }
  }

  // Subscribe to own changes (for multi-admin scenarios)
  subscribe(quiz.value.id)
})

onUnmounted(() => {
  unsubscribe()
})

// Push to Supabase on every quiz change
watch(
  () => JSON.stringify(quiz.value),
  () => {
    push()
  },
)

async function handleNewQuiz() {
  if (!confirm('Vytvoriť nový kvíz? Aktuálny kvíz zostane uložený v histórií.')) return
  const newQuiz = await createNewQuiz()
  router.replace({ query: { quiz: newQuiz.id } })
  subscribe(newQuiz.id)
}

function copyLink() {
  navigator.clipboard.writeText(leaderboardUrl.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
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
  flex-wrap: wrap;
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

.header-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
  align-items: center;
}

.history-link {
  font-size: 0.85rem;
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
}

.history-link:hover {
  text-decoration: underline;
}

.quiz-link-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.quiz-link-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  white-space: nowrap;
}

.quiz-link-url {
  font-size: 0.75rem;
  color: var(--accent);
  word-break: break-all;
  flex: 1;
  min-width: 0;
}

.admin-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
