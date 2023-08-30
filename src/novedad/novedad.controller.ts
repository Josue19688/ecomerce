import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, Put } from '@nestjs/common';
import { NovedadService } from './novedad.service';
import { CreateNovedadDto } from './dto/create-novedad.dto';
import { UpdateNovedadDto } from './dto/update-novedad.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Novedad } from './entities/novedad.entity';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.tdo';


@ApiTags('Novedad')
@Controller('novedad')
@Auth()
export class NovedadController {
  constructor(private readonly novedadService: NovedadService) {}

  @Post()
  @ApiResponse({status:201,description:'Producto was created', type:Novedad})
  @ApiResponse({status:400,description:'Bad Request'})
  @ApiResponse({status:403,description:'Forbidden Token related'})
  create(@Body() createNovedadDto: CreateNovedadDto,  @GetUser() user:User) {
    return this.novedadService.create(createNovedadDto,user);
  }

  @Get()
  findAll(@Query() paginatioDto:PaginationDto) {
    return this.novedadService.findAll(paginatioDto);
  }

  @Get(':termino')
  findOne(@Param('termino') termino: string) {
    return this.novedadService.findOnePlane(termino);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateNovedadDto: UpdateNovedadDto,
    @GetUser() user:User
    ) {
    return this.novedadService.update(id, updateNovedadDto,user);
  }

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.novedadService.remove(id);
  }
}
