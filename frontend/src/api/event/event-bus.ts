import { EventEmitter } from './event-emitter'
import { CrossTabEventEmitter } from './cross-tab-event-emitter'

export const globalBus = new EventEmitter()
export const globalCrossTabBus = new CrossTabEventEmitter()
