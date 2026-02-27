const STORAGE_KEY = 'refresher-pub-quiz'

export function saveQuiz(data: unknown): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
  catch (e) {
    console.error('Failed to save quiz data:', e)
  }
}

export function loadQuiz<T>(): T | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as { expiresAt?: number }

    // Check expiry
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }

    return parsed as T
  }
  catch (e) {
    console.error('Failed to load quiz data:', e)
    return null
  }
}

export function clearQuiz(): void {
  localStorage.removeItem(STORAGE_KEY)
}
