import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { Account } from "./Account";

@Entity("transactions")
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "integer",
  })
  amount: number;

  @Column({
    type: "text",
    nullable: true,
  })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Account, (account) => account.transactionsSent, {
    nullable: true,
  })
  originAccount: Account;

  @ManyToOne(() => Account, (account) => account.transactionsReceived, {
    nullable: false,
  })
  destinationAccount: Account;

  @Column()
  destinationBalance: number;
  
  @Column( {
    nullable: true,
  })
  originBalance: number;
}
