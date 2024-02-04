
import { Controller, Get, Post, Body, Patch, Param, Delete, Query,ParseUUIDPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.tdo';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './entities';
import { SearchDto } from 'src/common/dto/search.dto';

@ApiTags('Products')
@Controller('products')

export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}


  @Post()
  @ApiResponse({status:201,description:'Producto was created', type:Product})
  @ApiResponse({status:400,description:'Bad Request'})
  @ApiResponse({status:403,description:'Forbidden Token related'})
  @Auth()
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user:User
  ) {
    console.log(createProductDto)
    return this.productsService.create(createProductDto,user);
  }

  @Get()
  findAll(@Query() paginatioDto:PaginationDto) {
    return this.productsService.findAll(paginatioDto);
  }

  @Get('/search')
  findAllModelos(@Query() searchDto:SearchDto) {
    return this.productsService.findAllModels(searchDto);
  }

  @Get(':termino')
  findOne(@Param('termino') termino: string) {
    return this.productsService.findOnePlane(termino);
  }

  @Auth()
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
     @Body() updateProductDto: UpdateProductDto,
     @GetUser() user:User
    ) {
    return this.productsService.update(id, updateProductDto,user);
  }

  @Auth()
  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
