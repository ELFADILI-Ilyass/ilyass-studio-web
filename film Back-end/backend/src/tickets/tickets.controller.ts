import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private tickets: TicketsService) {}

  @Get()
  getAll() {
    return this.tickets.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.tickets.findOne(Number(id));
  }

  @Post()
  create(@Body() body: any) {
    return this.tickets.create(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tickets.remove(Number(id));
  }
}
