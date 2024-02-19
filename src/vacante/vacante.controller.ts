import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, Put } from '@nestjs/common';
import { VacanteService } from './vacante.service';
import { CreateVacanteDto } from './dto/create-vacante.dto';
import { UpdateVacanteDto } from './dto/update-vacante.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser, Auth } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.tdo';
import { Vacante } from './entities/vacante.entity';
import { CreateCandidatoDto } from './dto/candidato.dto';


@ApiTags('Vacantes')
@Controller('vacante')
export class VacanteController {
  constructor(private readonly vacanteService: VacanteService) {}

  @Post()
  @ApiResponse({status:201,description:'Post was created', type:Vacante})
  @ApiResponse({status:400,description:'Bad Request'})
  @ApiResponse({status:403,description:'Forbidden Token related'})
  @Auth()
  create(
    @Body() createVacanteDto: CreateVacanteDto,
    @GetUser() user:User
    ) {
    return this.vacanteService.create(createVacanteDto, user);
  }

  @Get()
  findAll() {
    return this.vacanteService.findAll();
  }


  //me traera las primeras 12 para mostrarlas en las paginas principales  
  @Get('/ten')
  findAllTenn(@Query() paginatioDto:PaginationDto) {
    return this.vacanteService.findAllTen(paginatioDto);
  }


  //me mostrara solo las que son especificas del creador no otras de otros creadores
  @Get('user')
  findAllVisitas(
    @GetUser() user:User
  ) {
    return this.vacanteService.findAllVacantes(user.id);
  }


  //me buscara por id u otro
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.vacanteService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id') id: string, 
    @Body() updateVacanteDto: UpdateVacanteDto,
    @GetUser() user:User
    ) {
    return this.vacanteService.update(id, updateVacanteDto, user);
  }

  @Put(':id')
  async updateCandidatos(
    @Param('id') id: string, 
    @Body() candidatosDto: CreateCandidatoDto[]
    ) {
      try {
        const vacante = await this.vacanteService.actualizarCandidatos(id, candidatosDto);
      // Serializa la respuesta utilizando stringify de circular-json
      
      return vacante;
      } catch (error) {
        throw error;
      }
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.vacanteService.remove(id);
  }
}
