import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { MantenimientoService } from './mantenimiento.service';
import { CreateMantenimientoDto } from './dto/create-mantenimiento.dto';
import { UpdateMantenimientoDto } from './dto/update-mantenimiento.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Mantenimiento } from './entities/mantenimiento.entity';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.tdo';



@ApiTags('Mantenimientos')
@Controller('mantenimiento')
@Auth()
export class MantenimientoController {
  constructor(private readonly mantenimientoService: MantenimientoService) {}

  @Post()
  @ApiResponse({status:201,description:'Mantenimiento was created', type:Mantenimiento})
  @ApiResponse({status:400,description:'Bad Request'})
  @ApiResponse({status:403,description:'Forbidden Token related'})
  create(@Body() createMantenimientoDto: CreateMantenimientoDto, @GetUser() user:User) {
    return this.mantenimientoService.create(createMantenimientoDto, user);
  }

  @Get()
  findAll(@Query() paginatioDto:PaginationDto) {
    return this.mantenimientoService.findAll(paginatioDto);
  }

  @Get(':termino')
  findOne(@Param('termino') termino: string) {
    return this.mantenimientoService.findOnePlane(termino);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateMantenimientoDto: UpdateMantenimientoDto,
    @GetUser() user:User
    ) {
    return this.mantenimientoService.update(id, updateMantenimientoDto,user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mantenimientoService.remove(id);
  }
}
