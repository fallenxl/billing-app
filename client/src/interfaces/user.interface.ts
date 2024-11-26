export interface IUser {
    authority: "CUSTOMER_USER" | "TENANT_ADMIN",
    customerId: {
        id: string,
    },
    id:{
        id: string,
    },
    email: string,
    firstName: string,
    lastName: string,
    name: string,
}