import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationsService {
  constructor(@InjectRepository(Location) private repo: Repository<Location>) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  create(body: any) {
    const loc = this.repo.create(body);
    return this.repo.save(loc);
  }

  async remove(id: number) {
    await this.repo.delete({ id });
    return { ok: true };
  }
}
