import { SearchFindAllDto } from './../common/dto/searchFindAll.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchDto } from 'src/common/dto/search.dto';
import { SearchTerminoDto } from 'src/common/dto/searchTermino.dto';
import { ApiTags } from '@nestjs/swagger';
import { GraficaModeloDto } from 'src/common/dto/graficaModelo.tdo';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';

@ApiTags('Search')
@Controller('search')
@Auth()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  findAllModelos(@Query() searchDto:SearchDto) {
    return this.searchService.findAllModelsDate(searchDto);
  }

  @Get('termino')
  findAllModelosTermino(@Query() searchTerminoDto:SearchTerminoDto) {
    return this.searchService.findAllModelsTermimo(searchTerminoDto);
  }

  @Get('todo')
  findAll(@Query() searchFindAllDto:SearchFindAllDto) {
    return this.searchService.findAllModelosTerminos(searchFindAllDto);
  }

  @Get('fecha')
  findAllFechas() {
    return this.searchService.SearchVisitaByDate();
  }


  ///garficas
  @Get('graficaCount')
  graficaModelo() {
    return this.searchService.countModels();
  }

  @Get('graficaNovedad')
  graficaNovedad(@Query() graficaModeloDto:GraficaModeloDto) {
    
    return this.searchService.graficas(graficaModeloDto);
  }

}
