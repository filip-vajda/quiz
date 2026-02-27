import type { Quiz } from '~~/shared/types/quiz'

const CHANNEL_NAME = 'refresher-pub-quiz-sync'

export function useBroadcastSync() {
  const { quizWritable, persist } = useQuizStore()
  let channel: BroadcastChannel | null = null

  function broadcast() {
    if (channel) {
      channel.postMessage({
        type: 'quiz-update',
        data: toRaw(quizWritable.value),
      })
    }
  }

  function listen(onUpdate?: () => void) {
    if (!channel) return
    channel.onmessage = (event: MessageEvent) => {
      if (event.data?.type === 'quiz-update') {
        const incoming = event.data.data as Quiz
        Object.assign(quizWritable.value, incoming)
        persist()
        onUpdate?.()
      }
    }
  }

  function initChannel() {
    if (typeof BroadcastChannel === 'undefined') return
    channel = new BroadcastChannel(CHANNEL_NAME)
  }

  function destroyChannel() {
    channel?.close()
    channel = null
  }

  return {
    broadcast,
    listen,
    initChannel,
    destroyChannel,
  }
}
