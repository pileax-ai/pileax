type EventListener = (...args: any[]) => void

interface BroadcastMessage {
  event: string
  args: any[]
}

export class CrossTabEventEmitter {
  private events: Record<string, EventListener[]> = {}
  private channel: BroadcastChannel

  constructor(channelName = 'app-cross-tab-channel') {
    this.channel = new BroadcastChannel(channelName)

    this.channel.onmessage = (messageEvent: MessageEvent<BroadcastMessage>) => {
      const { event, args } = messageEvent.data

      const callbacks = this.events[event]
      if (callbacks) {
        callbacks.forEach(cb => cb(...args))
      }
    }
  }

  on(event: string, callback: EventListener) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  // Emit event ONLY to other tabs (Excluding the current tab)
  emit(event: string, ...args: any[]) {
    // ❌ Removed the local callbacks.forEach() trigger

    // ✅ Send only to other open tabs via BroadcastChannel
    this.channel.postMessage({ event, args })
  }

  // Optional: If you sometimes DO want to trigger the current tab as well
  emitToAll(event: string, ...args: any[]) {
    // Trigger local
    const callbacks = this.events[event]
    if (callbacks) {
      callbacks.forEach(cb => cb(...args))
    }
    // Broadcast to others
    this.channel.postMessage({ event, args })
  }

  off(event: string, callback: EventListener) {
    const callbacks = this.events[event]
    if (callbacks) {
      this.events[event] = callbacks.filter(cb => cb !== callback)
    }
  }

  once(event: string, callback: EventListener) {
    const wrapper = (...args: any[]) => {
      callback(...args)
      this.off(event, wrapper)
    }
    this.on(event, wrapper)
  }

  destroy() {
    this.channel.close()
  }
}
