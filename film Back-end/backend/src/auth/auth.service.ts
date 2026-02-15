import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private users: UsersService) {}

  async signup(body: any) {
    const existing = await this.users.findByEmail(body.email);
    if (existing) return { ok: false, message: 'Email already exists' };

    const created = await this.users.create(body);

    // don't return password
    return {
      ok: true,
      user: {
        id: created.id,
        email: created.email,
        dob: created.dob,
        country: created.country,
      },
    };
  }

  async login(body: any) {
    const user = await this.users.findByEmail(body.email);
    if (!user) return { ok: false, message: 'Invalid credentials' };

    if (user.password !== body.password)
      return { ok: false, message: 'Invalid credentials' };

    return {
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        dob: user.dob,
        country: user.country,
      },
    };
  }
}
