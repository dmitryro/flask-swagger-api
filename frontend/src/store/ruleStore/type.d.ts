import { RuleStore as RuleStoreModel } from './index'

export as namespace IRuleStore

export interface RuleStore extends RuleStoreModel {}

export interface IRule {
    id: number
    name: string
    category: string
}
