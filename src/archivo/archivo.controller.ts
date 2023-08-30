import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ArchivoService } from './archivo.service';
import { CreateArchivoDto } from './dto/create-archivo.dto';
import { UpdateArchivoDto } from './dto/update-archivo.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { Archivo } from './entities/archivo.entity';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.tdo';


@ApiTags('Archivo')
@Controller('archivo')
@Auth()
export class ArchivoController {
  constructor(private readonly archivoService: ArchivoService) {}

  @Post()
  @ApiResponse({status:201,description:'Producto was created', type:Archivo})
  @ApiResponse({status:400,description:'Bad Request'})
  @ApiResponse({status:403,description:'Forbidden Token related'})
  create(@Body() createArchivoDto: CreateArchivoDto,  @GetUser() user:User) {
    return this.archivoService.create(createArchivoDto,user);
  }

  @Get()
  findAll(@Query() paginatioDto:PaginationDto) {
    return this.archivoService.findAll(paginatioDto);
  }

  @Get(':termino')
  findOne(@Param('termino') termino: string) {
    return this.archivoService.findOnePlane(termino);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateArchivoDto: UpdateArchivoDto,
    @GetUser() user:User
  ) {
    return this.archivoService.update(id, updateArchivoDto,user);
  }

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.archivoService.remove(id);
  }
}
