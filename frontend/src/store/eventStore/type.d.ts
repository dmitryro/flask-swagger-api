import { EventStore as EventStoreModel } from './index'

export as namespace IEventStore

export interface EventStore extends EventStoreModel {}

export interface IEvent {
    id: number
}
