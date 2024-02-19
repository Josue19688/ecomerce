import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VacanteService } from './vacante.service';
import { CreateVacanteDto } from './dto/create-vacante.dto';
import { UpdateVacanteDto } from './dto/update-vacante.dto';

@Controller('vacante')
export class VacanteController {
  constructor(private readonly vacanteService: VacanteService) {}

  @Post()
  create(@Body() createVacanteDto: CreateVacanteDto) {
    return this.vacanteService.create(createVacanteDto);
  }

  @Get()
  findAll() {
    return this.vacanteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vacanteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVacanteDto: UpdateVacanteDto) {
    return this.vacanteService.update(+id, updateVacanteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vacanteService.remove(+id);
  }
}
