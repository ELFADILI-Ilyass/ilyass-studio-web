import { Controller, Get, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @Get()
  getAll() {
    return this.payments.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.payments.create(body);
  }
}
