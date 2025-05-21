import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  
  @Entity("users")
  export class User {
    @PrimaryGeneratedColumn("increment")
    id: number;
  
    @Column("varchar", {
      length: 40,
      nullable: false,
    })
    name: string;
  
    @Column()
    password: string;
  
    @CreateDateColumn({ name: "created_at" })
    created_at: Date;
  
    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;
  }
  