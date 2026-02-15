import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private locations: LocationsService) {}

  @Get()
  getAll() {
    return this.locations.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.locations.findOne(Number(id));
  }

  @Post()
  create(@Body() body: any) {
    return this.locations.create(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locations.remove(Number(id));
  }
}
