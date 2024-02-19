import { Injectable } from '@nestjs/common';
import { CreateVacanteDto } from './dto/create-vacante.dto';
import { UpdateVacanteDto } from './dto/update-vacante.dto';

@Injectable()
export class VacanteService {
  create(createVacanteDto: CreateVacanteDto) {
    return 'This action adds a new vacante';
  }

  findAll() {
    return `This action returns all vacante`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vacante`;
  }

  update(id: number, updateVacanteDto: UpdateVacanteDto) {
    return `This action updates a #${id} vacante`;
  }

  remove(id: number) {
    return `This action removes a #${id} vacante`;
  }
}
