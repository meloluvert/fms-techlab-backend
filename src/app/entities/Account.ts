import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    DeleteDateColumn,
    ManyToOne,
    OneToMany
  } from "typeorm";
  import { AccountType } from "./AccountTypes";
  import { User } from "./User";
  import { Transaction } from "./Transaction";
  
  @Entity("accounts")
  export class Account extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @ManyToOne(() => User, (user) => user.accounts)
    user: User;
  
    @ManyToOne(() => AccountType, (accountType) => accountType.accounts)
    accountType: AccountType;
  
    @Column()
    balance: number;
  
    @Column({
      type: "text",
      nullable: true,
    })
    description: string;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn({
      nullable: true,
    })
    updated_at: Date;
  
    @DeleteDateColumn()
    deleted_at: Date;
  
    @OneToMany(() => Transaction, (transaction : Transaction) => transaction.originAccount)
    transactionsSent: Transaction[];
  
    @OneToMany(() => Transaction, (transaction : Transaction) => transaction.destinationAccount)
    transactionsReceived: Transaction[];
  }
  