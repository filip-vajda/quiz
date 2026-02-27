export interface Quiz {
  id: string
  name: string
  roundCount: number
  teams: Team[]
  scores: Record<string, number[]> // teamId → [round1pts, round2pts, ...]
  currentRound: number
  display: DisplayState
  createdAt: number
  expiresAt?: number
}

export interface QuizSummary {
  id: string
  name: string
  teamCount: number
  winner: string
  createdAt: string
}

export interface Team {
  id: string
  name: string
}

export interface DisplayState {
  visible: boolean
  revealMode: boolean
  revealedPosition: number // how many revealed so far (from last place)
}

export interface RankedTeam {
  team: Team
  roundScores: number[]
  total: number
  rank: number
}
