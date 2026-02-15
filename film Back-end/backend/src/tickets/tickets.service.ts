import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private tickets: Repository<Ticket>,
    @InjectRepository(User) private users: Repository<User>,
  ) {}

  findAll() {
    return this.tickets.find({ order: { id: 'DESC' } });
  }

  findOne(id: number) {
    return this.tickets.findOne({ where: { id } });
  }

  async create(body: any) {
    const userId = Number(body.userId);

    if (!body || !userId || Number.isNaN(userId)) {
      return { ok: false, message: 'Invalid userId' };
    }

    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) return { ok: false, message: 'User not found' };

    // required fields
    if (!body.country || !body.cinema || !body.showDate || !body.showTime) {
      return { ok: false, message: 'Missing fields (country/cinema/date/time)' };
    }

    const quantity = Number(body.quantity);
    const pricePerTicket = Number(body.pricePerTicket);

    if (Number.isNaN(quantity) || quantity < 1) {
      return { ok: false, message: 'Invalid quantity' };
    }

    if (Number.isNaN(pricePerTicket) || pricePerTicket < 1) {
      return { ok: false, message: 'Invalid pricePerTicket' };
    }

    // IMPORTANT: server calculates total (never trust client)
    const safeTotal = quantity * pricePerTicket;

    const ticket = this.tickets.create({
      movieTitle: body.movieTitle || 'Requiem of the Cosmos',
      ticketType: body.ticketType || 'PRETICKET',
      country: String(body.country),
      cinema: String(body.cinema),
      showDate: String(body.showDate),
      showTime: String(body.showTime),
      quantity,
      pricePerTicket,
      totalPrice: safeTotal,
      isPreTicket: true,
      user,
    });

    const saved = await this.tickets.save(ticket);
    return { ok: true, ticket: saved };
  }

  async remove(id: number) {
    await this.tickets.delete({ id });
    return { ok: true };
  }
}
