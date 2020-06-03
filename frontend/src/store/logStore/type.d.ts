import { LogStore as LogStoreModel } from './index'

export as namespace ILogStore

export interface LogStore extends LogStoreModel {}

export interface ILog {
    id: number
    severety: string
    action_id: number
    body: string
    event_id: number
    header: string
    profile_key: string
    recorded_at: date
    type_id: number 
    ip: string
}
