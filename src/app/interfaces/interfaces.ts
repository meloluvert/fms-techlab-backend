export interface IUser {
    id?:string,
    name: string,
    email: string,
    password?: string
    created_at?: string
    updated_at?:string 

}
export interface IUserPayload {
    id: string;
    email: string;
  }

export interface IAccountType{
    name: string;
    id?: string;
    user_id?: string 
}

export interface IAccount {
    name?: string;
    id?: string;
    balance?: string | number;
    type_id?: string;
    updated_at?:Date | string;
    created_at?:Date | string;
    description?:string;
    color?: string;
    user_id?: string
    
}

export interface ITransaction {
    type?: string;
    amount: number; 
    originAccount?: IAccount
    destinationAccount?: IAccount
    description?: string
    date?: string;
}