import { ActionStore as ActionStoreModel } from './index'

export as namespace IActionStore

export interface ActionStore extends ActionStoreModel {}

export interface IAction {
    id: number
    isrunning: string
    last_run: date
    name: string
    profile_key: string
}
