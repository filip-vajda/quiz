import type { Quiz } from '~~/shared/types/quiz'

export function exportQuiz(quiz: Quiz): void {
  const blob = new Blob([JSON.stringify(quiz, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${quiz.name || 'quiz'}-backup.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importQuiz(file: File): Promise<Quiz> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as Quiz
        if (!data.id || !data.teams || !data.scores) {
          reject(new Error('Neplatný formát súboru'))
          return
        }
        resolve(data)
      }
      catch {
        reject(new Error('Nepodarilo sa načítať súbor'))
      }
    }
    reader.onerror = () => reject(new Error('Chyba pri čítaní súboru'))
    reader.readAsText(file)
  })
}
