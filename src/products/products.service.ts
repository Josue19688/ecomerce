import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Between, DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.tdo';
import { validate as isUUID } from 'uuid';
import { ProductImage, Product } from './entities';
import { User } from 'src/auth/entities/user.entity';
import { SearchDto } from 'src/common/dto/search.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,

    private readonly dataSource: DataSource,
  ) { }


  async create(createProductDto: CreateProductDto,user:User) {
    try {

     
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image })),
        user
      });
      await this.productRepository.save(product);
      return { ...product, images };

    } catch (error) {

      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    })

    return products.map(product => ({
      ...product,
      images: product.images.map(img => img.url)
    }))
  }


  async findAllModels(searchDto: SearchDto) {
    const { inicio,  fin, modelo } = searchDto;

    

    let data:any[]=[];

    
    switch(modelo){
      case 'producto':
        const products = await this.productRepository.find({
          where:{
            createdAt: Between(
              new Date(inicio), 
              new Date(fin)
          ),
          },
          relations: {
            images: true
          }
        })
       
        data =  products.map(product => ({
          ...product,
          images: product.images.map(img => img.url)
        }))
        break;
      case 'user':
        data = await this.userRepository.find({
            where:{
              createdAt: Between(
                new Date(inicio), 
                new Date(fin)
            ),
            },
        })
        break;
      default:
        return {ok:false,msg:'Collecion no encontrada'};
      
    }

    return data;
    
  }

  async findOne(termino: string) {

    let producto: Product;

    if (isUUID(termino)) {
      producto = await this.productRepository.findOneBy({ id: termino });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      producto = await queryBuilder
        .where('UPPER(title)=:title or slug=:slug', {
          title: termino.toUpperCase(),
          slug: termino.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }

    if (!producto) throw new NotFoundException(`El registro con ${termino} no existe.`);

    return producto;
  }

  async findOnePlane(termino: string) {
    const { images = [], ...rest } = await this.findOne(termino);
    return {
      ...rest,
      images: images.map(image => image.url)
    }
  }

  /**
   * 
   * @param id del producto
   * @param updateProductDto  arreglo de datos tipo dto del producto
   * @param user usuario que esta haciendo la insercion o peticion
   * @returns arreglo de datos
   */
  async update(
    id: string, 
    updateProductDto:
     UpdateProductDto,
     user:User) {

    const { images, ...toUpdate } = updateProductDto;
    const product = await this.productRepository.preload({
      id,
      ...toUpdate
    });

    if (!product) throw new NotFoundException(`El registro con ${id} no existe`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map(image => 
          this.productImageRepository.create({ url: image,user })
        )
      }


      product.user=user;
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();


      return this.findOnePlane(id);

    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const producto = await this.findOne(id);
    await this.productRepository.remove(producto);
    return {ok:true,msg:'Producto Eliminado'};
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`El registro ya existe!!`);
    }
    if (error.code === '23505') {
      throw new BadRequestException(`El registro ya existe!!`);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(`Error al crear el registro en el servidor`);
  }

  /**
   * Eliminar productos de la db solo en desarrollo
   * @returns delete all
   */
  async deleteAllProducts(){
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query.delete().where({}).execute();
      
    } catch (error) {
      this.handleExceptions(error);
    }
  }

}
