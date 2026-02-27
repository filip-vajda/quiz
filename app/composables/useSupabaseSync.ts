import type { Quiz } from '~~/shared/types/quiz'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface QuizRow {
  id: string
  name: string
  round_count: number
  teams: unknown[]
  scores: Record<string, number[]>
  current_round: number
  display: { visible: boolean; revealMode: boolean; revealedPosition: number }
  created_at: string
  updated_at: string
}

function mapQuizToRow(q: Quiz): Omit<QuizRow, 'created_at' | 'updated_at'> {
  return {
    id: q.id,
    name: q.name,
    round_count: q.roundCount,
    teams: q.teams,
    scores: q.scores,
    current_round: q.currentRound,
    display: q.display,
  }
}

function mapRowToQuiz(row: QuizRow): Quiz {
  return {
    id: row.id,
    name: row.name,
    roundCount: row.round_count,
    teams: row.teams as Quiz['teams'],
    scores: row.scores as Quiz['scores'],
    currentRound: row.current_round,
    display: row.display,
    createdAt: new Date(row.created_at).getTime(),
  }
}

export function useSupabaseSync() {
  const client = useSupabaseClient()
  const { quizWritable, persist } = useQuizStore()

  let channel: RealtimeChannel | null = null
  let pushTimer: ReturnType<typeof setTimeout> | null = null

  function push() {
    if (pushTimer) clearTimeout(pushTimer)
    pushTimer = setTimeout(async () => {
      const row = mapQuizToRow(toRaw(quizWritable.value))
      const { error } = await client
        .from('quizzes')
        .upsert({ ...row, updated_at: new Date().toISOString() })
      if (error) console.error('Supabase push error:', error.message)
    }, 150)
  }

  function subscribe(quizId: string, onUpdate?: () => void) {
    unsubscribe()
    channel = client
      .channel(`quiz-${quizId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quizzes',
          filter: `id=eq.${quizId}`,
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object' && 'id' in payload.new) {
            const incoming = mapRowToQuiz(payload.new as QuizRow)
            Object.assign(quizWritable.value, incoming)
            persist()
            onUpdate?.()
          }
        },
      )
      .subscribe()
  }

  function unsubscribe() {
    if (channel) {
      client.removeChannel(channel)
      channel = null
    }
  }

  async function fetchQuiz(quizId: string): Promise<Quiz | null> {
    const { data, error } = await client
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single()
    if (error || !data) return null
    return mapRowToQuiz(data as QuizRow)
  }

  async function deleteQuiz(quizId: string): Promise<boolean> {
    const { error } = await client.from('quizzes').delete().eq('id', quizId)
    return !error
  }

  return {
    push,
    subscribe,
    unsubscribe,
    fetchQuiz,
    deleteQuiz,
    mapRowToQuiz,
    mapQuizToRow,
  }
}
