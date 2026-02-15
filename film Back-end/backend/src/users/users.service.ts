import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async create(data: any) {
    const user = this.repo.create({
      email: data.email,
      password: data.password,
      dob: data.dob,
      country: data.country,
    });
    return await this.repo.save(user);
  }

  async update(id: number, data: any) {
    await this.repo.update({ id }, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const u = await this.findOne(id);
    if (!u) return { ok: false, message: 'User not found' };
    await this.repo.delete({ id });
    return { ok: true };
  }
}
