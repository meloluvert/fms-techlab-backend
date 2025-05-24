import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    DeleteDateColumn,
    OneToMany,
    ManyToOne
  } from "typeorm";
import { Account } from "./Account";
  import { User } from "./User";
  
  @Entity("account_types")
  export class AccountType extends BaseEntity{
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({
        type: "varchar",
        length:"40"
    })
    name:string

    @OneToMany(() => Account, (account) => account.accountType)
    accounts: Account[]

    
  
}