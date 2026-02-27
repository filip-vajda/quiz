import type { Quiz, Team, DisplayState } from '~~/shared/types/quiz'
import { saveQuiz, loadQuiz, clearQuiz } from '~/utils/storage'

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000

function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}

function createEmptyQuiz(): Quiz {
  const now = Date.now()
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
    createdAt: now,
    expiresAt: now + TWENTY_FOUR_HOURS,
  }
}

const quiz = ref<Quiz>(createEmptyQuiz())
let initialized = false

export function useQuizStore() {
  function init() {
    if (initialized) return
    initialized = true
    const saved = loadQuiz<Quiz>()
    if (saved) {
      quiz.value = saved
    }
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
    // Refresh expiry
    quiz.value.expiresAt = Date.now() + TWENTY_FOUR_HOURS
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
