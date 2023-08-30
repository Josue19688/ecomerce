import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { AgenteService } from './agente.service';
import { CreateAgenteDto } from './dto/create-agente.dto';
import { UpdateAgenteDto } from './dto/update-agente.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Agente } from './entities/agente.entity';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.tdo';

@ApiTags('Agente')
@Controller('agente')
@Auth()
export class AgenteController {
  constructor(private readonly agenteService: AgenteService) {}

  @Post()
  @ApiResponse({status:201,description:'Agente was created', type:Agente})
  @ApiResponse({status:400,description:'Bad Request'})
  @ApiResponse({status:403,description:'Forbidden Token related'})
  create(@Body() createAgenteDto: CreateAgenteDto,  @GetUser() user:User) {
    return this.agenteService.create(createAgenteDto,user);
  }

  @Get()
  findAll(@Query() paginatioDto:PaginationDto) {
    return this.agenteService.findAll(paginatioDto);
  }

  @Get(':termino')
  findOne(@Param('termino') termino: string) {
    return this.agenteService.findOnePlane(termino);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateAgenteDto: UpdateAgenteDto,
    @GetUser() user:User
  ) {
    return this.agenteService.update(id, updateAgenteDto,user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string,) {
    return this.agenteService.remove(id);
  }
}
