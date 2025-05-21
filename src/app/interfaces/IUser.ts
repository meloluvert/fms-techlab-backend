interface IUser {
    id?:number,
    name: string,
    email: string,
    password?: string
    created_at?: string
    updated_at?:string 

}
export default IUser