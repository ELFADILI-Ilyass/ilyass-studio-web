import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  amount: number;

  @Column()
  method: string; // "card", "cash" etc

  @ManyToOne(() => User, (u) => u.payments, { eager: true })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
