import { RuleStore as RuleStoreModel } from './index'

export as namespace IRuleStore

export interface RuleStore extends RuleStoreModel {}

export interface IRule {
    id: number
    is_active: boolean
    isactive: string
    severety: string
    name: string
    code: string 
    when_created: date
}
