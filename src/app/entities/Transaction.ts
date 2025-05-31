import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Account } from "./Account";

@Entity("transactions")
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "integer" })
  amount: number | string;

  @Column({ type: "text", nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date | string;

  // FK explícita para originAccountId
  @Column({ type: "uuid", nullable: true })
  originAccountId: string | null;

  @ManyToOne(() => Account, (account) => account.transactionsSent, {
    nullable: true,
  })
  @JoinColumn({ name: "originAccountId" }) 
  originAccount: Account | null;

  @Column({ type: "uuid", nullable:true })
  destinationAccountId: string;

  @ManyToOne(() => Account, (account) => account.transactionsReceived, {
    nullable: false,
  })
  @JoinColumn({ name: "destinationAccountId" }) // liga a FK à relação
  destinationAccount: Account | null;

  @Column({ type: "integer", nullable:true })
  destinationBalance: number | string;

  @Column({ nullable: true, type: "integer" })
  originBalance: number | null | string;
}
