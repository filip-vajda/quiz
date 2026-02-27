import type { Quiz, Team, DisplayState } from '~~/shared/types/quiz'
import { saveQuiz, loadQuiz, clearQuiz } from '~/utils/storage'

function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}

function createEmptyQuiz(): Quiz {
  return {
    id: generateId(),
    name: '',
    roundCount: 5,
    teams: [],
    scores: {},
    currentRound: 1,
    display: {
      visible: false,
      revealMode: false,
      revealedPosition: 0,
    },
    createdAt: Date.now(),
  }
}

const quiz = ref<Quiz>(createEmptyQuiz())
let initialized = false

export function useQuizStore() {
  function init(quizId?: string) {
    if (initialized && !quizId) return
    initialized = true

    if (quizId) {
      // When loading from Supabase, fetch is handled externally
      // and quiz is set via loadFromRemote
      const saved = loadQuiz<Quiz>()
      if (saved && saved.id === quizId) {
        quiz.value = saved
      }
      return
    }

    const saved = loadQuiz<Quiz>()
    if (saved) {
      quiz.value = saved
    }
  }

  async function loadFromRemote(quizId: string): Promise<boolean> {
    const { fetchQuiz } = useSupabaseSync()
    const remote = await fetchQuiz(quizId)
    if (remote) {
      quiz.value = remote
      persist()
      return true
    }
    return false
  }

  async function createNewQuiz(): Promise<Quiz> {
    const newQuiz = createEmptyQuiz()
    quiz.value = newQuiz
    persist()

    // Push to Supabase immediately (no debounce)
    const client = useSupabaseClient()
    const { mapQuizToRow } = useSupabaseSync()
    const row = mapQuizToRow(newQuiz)
    const { error } = await client
      .from('quizzes')
      .insert({ ...row, updated_at: new Date().toISOString() })
    if (error) console.error('Failed to create quiz in Supabase:', error.message)

    return newQuiz
  }

  function persist() {
    saveQuiz(quiz.value)
  }

  // Quiz setup
  function setQuizName(name: string) {
    quiz.value.name = name
    persist()
  }

  function setRoundCount(count: number) {
    quiz.value.roundCount = Math.max(1, Math.min(20, count))
    // Trim scores if rounds reduced
    for (const teamId of Object.keys(quiz.value.scores)) {
      if (quiz.value.scores[teamId].length > quiz.value.roundCount) {
        quiz.value.scores[teamId] = quiz.value.scores[teamId].slice(0, quiz.value.roundCount)
      }
    }
    persist()
  }

  // Team management
  function addTeam(name: string): Team {
    const team: Team = { id: generateId(), name: name.trim() }
    quiz.value.teams.push(team)
    quiz.value.scores[team.id] = Array(quiz.value.roundCount).fill(0)
    persist()
    return team
  }

  function updateTeamName(teamId: string, name: string) {
    const team = quiz.value.teams.find(t => t.id === teamId)
    if (team) {
      team.name = name.trim()
      persist()
    }
  }

  function removeTeam(teamId: string) {
    quiz.value.teams = quiz.value.teams.filter(t => t.id !== teamId)
    delete quiz.value.scores[teamId]
    persist()
  }

  // Score management
  function setScore(teamId: string, roundIndex: number, score: number) {
    if (!quiz.value.scores[teamId]) {
      quiz.value.scores[teamId] = Array(quiz.value.roundCount).fill(0)
    }
    quiz.value.scores[teamId][roundIndex] = score
    persist()
  }

  function setCurrentRound(round: number) {
    quiz.value.currentRound = Math.max(1, Math.min(quiz.value.roundCount, round))
    persist()
  }

  // Display controls
  function setDisplay(display: Partial<DisplayState>) {
    quiz.value.display = { ...quiz.value.display, ...display }
    persist()
  }

  // Import full quiz
  function importQuizData(data: Quiz) {
    quiz.value = data
    persist()
  }

  // Reset
  function resetQuiz() {
    quiz.value = createEmptyQuiz()
    clearQuiz()
    persist()
  }

  return {
    quiz: readonly(quiz) as Readonly<Ref<Quiz>>,
    quizWritable: quiz,
    init,
    loadFromRemote,
    createNewQuiz,
    persist,
    setQuizName,
    setRoundCount,
    addTeam,
    updateTeamName,
    removeTeam,
    setScore,
    setCurrentRound,
    setDisplay,
    importQuizData,
    resetQuiz,
  }
}
