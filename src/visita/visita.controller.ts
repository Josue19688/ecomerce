import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, Put } from '@nestjs/common';
import { VisitaService } from './visita.service';
import { CreateVisitaDto } from './dto/create-visita.dto';
import { UpdateVisitaDto } from './dto/update-visita.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { Visita } from './entities/visita.entity';
import { PaginationDto } from 'src/common/dto/pagination.tdo';
import { User } from 'src/auth/entities/user.entity';


@ApiTags('Visita')
@Controller('visita')
@Auth()
export class VisitaController {
  constructor(private readonly visitaService: VisitaService) {}

  @Post()
  @ApiResponse({status:201,description:'Producto was created', type:Visita})
  @ApiResponse({status:400,description:'Bad Request'})
  @ApiResponse({status:403,description:'Forbidden Token related'})
  create(@Body() createVisitaDto: CreateVisitaDto,  @GetUser() user:User) {
    return this.visitaService.create(createVisitaDto,user);
  }

  @Get()
  findAll(@Query() paginatioDto:PaginationDto) {
    return this.visitaService.findAll(paginatioDto);
  }

  @Get('autorization')
  findAllAutorization() {
    return this.visitaService.findAllAutorizationAdmin();
  }


  @Get('autorizationSeguridad')
  findAllAutorizationSeguridad() {
    return this.visitaService.findAllAutorizationSeguridad();
  }


  @Get('user')
  findAllVisitas(
    @GetUser() user:User
  ) {
    return this.visitaService.findAllVisitas(user.id);
  }

  @Get(':termino')
  findOne(@Param('termino') termino: string) {
    return this.visitaService.findOnePlane(termino);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVisitaDto: UpdateVisitaDto,
    @GetUser() user:User
  ) {
    return this.visitaService.update(id, updateVisitaDto,user);
  }

  @Put('authorizationVisita/:id')
  updateAutorizacion(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVisitaDto: UpdateVisitaDto,
    @GetUser() user:User
  ) {
    return this.visitaService.updateAutorizacion(id, updateVisitaDto,user);
  }

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.visitaService.remove(id);
  }
}
