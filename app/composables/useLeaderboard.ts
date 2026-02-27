import type { RankedTeam } from '~~/shared/types/quiz'

export function useLeaderboard() {
  const { quiz } = useQuizStore()

  const rankings = computed<RankedTeam[]>(() => {
    const ranked = quiz.value.teams.map((team) => {
      const roundScores = quiz.value.scores[team.id] || []
      const total = roundScores.reduce((sum, s) => sum + (s || 0), 0)
      return { team, roundScores, total, rank: 0 }
    })

    // Sort by total descending
    ranked.sort((a, b) => b.total - a.total)

    // Assign ranks with tie handling (same score = same rank)
    let currentRank = 1
    for (let i = 0; i < ranked.length; i++) {
      if (i > 0 && ranked[i].total < ranked[i - 1].total) {
        currentRank = i + 1
      }
      ranked[i].rank = currentRank
    }

    return ranked
  })

  // Rankings ordered last-to-first for reveal
  const rankingsReversed = computed(() => [...rankings.value].reverse())

  return {
    rankings,
    rankingsReversed,
  }
}
