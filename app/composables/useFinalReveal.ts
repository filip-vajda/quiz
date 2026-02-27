export function useFinalReveal() {
  const { quiz } = useQuizStore()
  const { rankings } = useLeaderboard()
  const { setDisplay } = useQuizStore()
  const { broadcast } = useBroadcastSync()

  let timer: ReturnType<typeof setTimeout> | null = null

  const totalTeams = computed(() => rankings.value.length)
  const revealedCount = computed(() => quiz.value.display.revealedPosition)
  const isRevealing = computed(() => quiz.value.display.revealMode)
  const isComplete = computed(() => revealedCount.value >= totalTeams.value)

  // Get the teams that should be visible during reveal
  // Revealed last-to-first, but displayed with best rank on top (prepend order)
  const revealedTeams = computed(() => {
    if (!quiz.value.display.revealMode) return []
    const reversed = [...rankings.value].reverse()
    return reversed.slice(0, revealedCount.value).reverse()
  })

  // The team currently being revealed
  const currentRevealTeam = computed(() => {
    if (revealedCount.value === 0) return null
    const reversed = [...rankings.value].reverse()
    return reversed[revealedCount.value - 1] || null
  })

  function startReveal() {
    setDisplay({ revealMode: true, revealedPosition: 0, visible: true })
    broadcast()
  }

  function revealNext() {
    if (revealedCount.value >= totalTeams.value) return
    setDisplay({ revealedPosition: revealedCount.value + 1 })
    broadcast()
  }

  function autoReveal(delayMs = 3000) {
    if (revealedCount.value >= totalTeams.value) {
      stopAuto()
      return
    }

    revealNext()

    // Longer pause for top 3
    const remaining = totalTeams.value - revealedCount.value
    const delay = remaining <= 3 ? delayMs * 1.5 : delayMs

    timer = setTimeout(() => autoReveal(delayMs), delay)
  }

  function stopAuto() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function exitReveal() {
    stopAuto()
    setDisplay({ revealMode: false, revealedPosition: 0 })
    broadcast()
  }

  return {
    isRevealing,
    isComplete,
    revealedCount,
    totalTeams,
    revealedTeams,
    currentRevealTeam,
    startReveal,
    revealNext,
    autoReveal,
    stopAuto,
    exitReveal,
  }
}
