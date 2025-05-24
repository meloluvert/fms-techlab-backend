import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity, OneToMany,
    DeleteDateColumn
  } from "typeorm";

  import { Account } from "./Account";
  
  @Entity("users")
  export class User extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column("varchar", {
      length: 40,
      nullable: false,
    })
    name: string;

    @Column({
      unique: true
    })
    email:string;
  
    @Column()
    password: string;

    @OneToMany(type => Account, account => account.user)
    accounts: Account[];
    

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;

    
  }
  