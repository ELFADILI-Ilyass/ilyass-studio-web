import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Requiem of the Cosmos' })
  movieTitle: string;

  @Column({ default: 'PRETICKET' })
  ticketType: string;

  @Column()
  country: string;

  @Column()
  cinema: string;

  @Column({ type: 'date' })
  showDate: string; // YYYY-MM-DD

  @Column()
  showTime: string; // "14:00"

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int' })
  pricePerTicket: number;

  @Column({ type: 'int' })
  totalPrice: number;

  @Column({ default: true })
  isPreTicket: boolean;

  @ManyToOne(() => User, (u) => u.tickets, { eager: true })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
