import { ActionStore as ActionStoreModel } from './index'

export as namespace IActionStore

export interface ActionStore extends ActionStoreModel {}

export interface IAction {
    id: number
}
