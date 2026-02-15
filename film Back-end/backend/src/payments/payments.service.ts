import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private payments: Repository<Payment>,
    @InjectRepository(User) private users: Repository<User>,
  ) {}

  findAll() {
    return this.payments.find();
  }

  async create(body: any) {
    // expects: { amount, method, userId }
    const user = await this.users.findOne({ where: { id: Number(body.userId) } });
    if (!user) return { ok: false, message: 'User not found' };

    const p = this.payments.create({
      amount: Number(body.amount),
      method: body.method,
      user,
    });

    return { ok: true, payment: await this.payments.save(p) };
  }
}
