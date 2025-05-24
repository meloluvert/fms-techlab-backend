export interface IUser {
    id?:number,
    name: string,
    email: string,
    password?: string
    created_at?: string
    updated_at?:string 

}
export interface IAccountType{
    name: string;
    id?: number;
}

export interface IAccount {
    name?: string;
    id?: string;
    balance: string;
    type?: string;
    updated_at?:string;
    created_at?:string;
    description?:string;
    color?: string;
    user_id?: string
    
}

export interface ITransaction {
    type: string;
    amount: number; // valor transferido
    sourceAccount?: {
        name: string;
        balance: number;
    };
    destinationAccount?: {
        name: string;
        balance: number;
    };
    date: string;
}