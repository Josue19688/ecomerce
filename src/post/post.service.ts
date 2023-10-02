import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostImage } from './entities/post-image.entity';
import { validate as isUUID } from 'uuid';
import { PaginationDto } from 'src/common/dto/pagination.tdo';

@Injectable()
export class PostService {

  private readonly logger = new Logger('PostService')

  constructor(
    @InjectRepository(Post)
    private readonly postRepository:Repository<Post>,
    @InjectRepository(PostImage)
    private readonly postImageRepository:Repository<PostImage>,
   

    private readonly dataSource:DataSource
  ){}



  async create(createPostDto: CreatePostDto) {
    try {
      const {images=[], ...postDetails}=createPostDto;
      const post = this.postRepository.create({
        ...postDetails,
        images:images.map(image=>this.postImageRepository.create({url:image}))
      })

      await this.postRepository.save(post);
      const posts = {...post, images};

     
      
      return {ok:true, posts }
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto:PaginationDto) {
    const { limit = 12, offset = 0 } = paginationDto;
    const visita = await this.postRepository.find({
      take:limit,
      order: {
        fechas: 'DESC', // Ordenar por fecha de creación en orden descendente
      },
      relations:{
        images:true
      }
    })

    const visitas = visita.map(item=>({
      ...item,
      images:item.images.map(img=>img.url)
    }))

    return {ok:true, visitas};
  }

  async findOne(termino: string) {
    let post:Post;

    if(isUUID(termino)){
      post = await this.postRepository.findOneBy({id:termino});
    }else{
      const  queryBuilder = this.postRepository.createQueryBuilder('nov');
      post = await queryBuilder
      .where('title=:title or descripcion=:descripcion ',{
        title: termino.toUpperCase(),
        descripcion: termino.toLowerCase(),
      })
      .leftJoinAndSelect('nov.images', 'novImages')
      .getOne();
    }

    if(!post) throw new NotFoundException(`El registro con ${termino} no existe.`);

    return post;
  }

  async findOnePlane(termino:string){
    const {images = [], ...rest}= await this.findOne(termino);
    const post = {
      ...rest,
      images:images.map(img=>img.url)
    };

    return {ok:true, post}

  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    
    const { images, ...toUpdate } = updatePostDto;
    const post = await this.postRepository.preload({
      id,
      ...toUpdate
    });

    if (!post) throw new NotFoundException(`El registro con ${id} no existe`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if (images) {
        await queryRunner.manager.delete(PostImage, { post: { id } });
        post.images = images.map(image => 
          this.postImageRepository.create({ url: image })
        )
      }

      await queryRunner.manager.save(post);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      
      return this.findOnePlane(id);

    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleExceptions(error);
    }
  }

  async updateComments(id: string, updatePostDto: UpdatePostDto) {
    
    const { images, ...toUpdate } = updatePostDto;
    const post = await this.postRepository.preload({
      id,
      ...toUpdate
    });

    if (!post) throw new NotFoundException(`El registro con ${id} no existe`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

     

      await queryRunner.manager.save(post);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      
      return this.findOnePlane(id);

    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleExceptions(error);
    }
  }


  remove(id: number) {
    return `This action removes a #${id} post`;
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
}
