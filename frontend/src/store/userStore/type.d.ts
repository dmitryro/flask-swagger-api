import { UserStore as UserStoreModel } from './index'

export as namespace IUserStore

export interface UserStore extends UserStoreModel {}

export interface IUser {
    id: number
    bio: string
    username: string
    first_name: string
    last_name: string
    last_login: date
    date_joined:date
    email: string
    password: string
    category: string
}
