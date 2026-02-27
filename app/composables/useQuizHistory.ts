import type { QuizSummary } from '~~/shared/types/quiz'

export function useQuizHistory() {
  const client = useSupabaseClient()
  const items = ref<QuizSummary[]>([])
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    try {
      const { data, error } = await client
        .from('quizzes')
        .select('id, name, teams, scores, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Failed to fetch quiz history:', error.message)
        return
      }

      items.value = (data || []).map((row: any) => {
        const teams = (row.teams || []) as { id: string; name: string }[]
        const scores = (row.scores || {}) as Record<string, number[]>

        let winner = ''
        if (teams.length > 0) {
          let bestTotal = -1
          for (const t of teams) {
            const total = (scores[t.id] || []).reduce((a: number, b: number) => a + b, 0)
            if (total > bestTotal) {
              bestTotal = total
              winner = t.name
            }
          }
        }

        return {
          id: row.id,
          name: row.name || 'Bez názvu',
          teamCount: teams.length,
          winner,
          createdAt: row.created_at,
        }
      })
    }
    finally {
      loading.value = false
    }
  }

  async function deleteQuiz(id: string) {
    const { error } = await client.from('quizzes').delete().eq('id', id)
    if (error) {
      console.error('Failed to delete quiz:', error.message)
      return false
    }
    items.value = items.value.filter(q => q.id !== id)
    return true
  }

  return {
    items,
    loading,
    fetchAll,
    deleteQuiz,
  }
}
