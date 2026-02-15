import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Payment } from '../../payments/entities/payment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  dob: string;

  @Column({ nullable: true })
  country: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Ticket, (t) => t.user)
  tickets: Ticket[];

  @OneToMany(() => Payment, (p) => p.user)
  payments: Payment[];
}
