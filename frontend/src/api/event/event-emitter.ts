type EventListener = (...args: any[]) => void

export class EventEmitter {
  private events: Record<string, EventListener[]> = {}

  // Listen on event
  on(event: string, callback: EventListener) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  // Emit event
  emit(event: string, ...args: any[]) {
    const callbacks = this.events[event]
    if (callbacks) {
      callbacks.forEach(cb => cb(...args))
    }
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
}
