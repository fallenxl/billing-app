export interface IUser {
    sub: string
    firstName: string
    lastName: string
    scopes: string[]
    customerId: string
    userId: string
    enabled: boolean
}