import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    DeleteDateColumn,
    OneToMany,
    ManyToOne, ManyToMany, JoinTable
  } from "typeorm";
import { Account } from "./Account";
  import { User } from "./User";
  
  @Entity("account_types")
  export class AccountType extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string | number;

    @Column({
        type: "varchar",
        length:"40"
    })
    name:string

    @ManyToMany(() => User)
    @JoinTable()
    user: User[]

    @OneToMany(() => Account, (account) => account.accountType)
    accounts: Account[]

    @DeleteDateColumn()
    deleted_at: Date;

    
  
}