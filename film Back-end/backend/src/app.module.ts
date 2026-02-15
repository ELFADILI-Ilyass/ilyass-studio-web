import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LocationsModule } from './locations/locations.module';
import { TicketsModule } from './tickets/tickets.module';
import { PaymentsModule } from './payments/payments.module';

// import { User } from './users/entities/user.entity';
// import { Location } from './locations/entities/location.entity';
// import { Ticket } from './tickets/entities/ticket.entity';
// import { Payment } from './payments/entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '20040426',
  database: 'film_db',
  autoLoadEntities: true,
  synchronize: true, // DEV ONLY
}),


    UsersModule,
    AuthModule,
    LocationsModule,
    TicketsModule,
    PaymentsModule,
  ],
})
export class AppModule {}
