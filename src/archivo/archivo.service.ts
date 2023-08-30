import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateArchivoDto } from './dto/create-archivo.dto';
import { UpdateArchivoDto } from './dto/update-archivo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Archivo } from './entities/archivo.entity';
import { DataSource, Repository } from 'typeorm';
import { ArchivoImage } from './entities/archivo-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.tdo';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ArchivoService {

  private readonly logger = new Logger('ArchivoService')

  constructor(
    @InjectRepository(Archivo)
    private readonly archivoRepository:Repository<Archivo>,
    @InjectRepository(ArchivoImage)
    private readonly archivoImagenRepository:Repository<ArchivoImage>,
    private readonly dataSource:DataSource
  ){}
  async create(createArchivoDto: CreateArchivoDto,user:User) {
    try {
      const {images=[], ...archivoDetails}=createArchivoDto;
      const archivo = this.archivoRepository.create({
        ...archivoDetails,
        images:images.map(image=>this.archivoImagenRepository.create({url:image})),
        user
      })

      await this.archivoRepository.save(archivo);
      const archivos = {...archivo, images};
      return {ok:true, archivos }
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto:PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const archivo = await this.archivoRepository.find({
      take:limit,
      skip:offset,
      relations:{
        images:true
      }
    })

    const archivos =archivo.map(item=>({
      ...item,
      images:item.images.map(img=>img.url)
    }))

    return {ok:true, archivos};
  }

  async findOne(termino:string) {
    let archivo:Archivo;

    if(isUUID(termino)){
      archivo = await this.archivoRepository.findOneBy({id:termino});
    }else{
      const  queryBuilder = this.archivoRepository.createQueryBuilder('arh');
      archivo = await queryBuilder
      .where('UPPER(tipo)=:tipo or correlativo=:correlativo or clasificacion=:clasificacion or unidad=:unidad  or descripcion=:descripcion ',{
        tipo: termino.toUpperCase(),
        correlativo: termino.toLowerCase(),
        clasificacion: termino.toUpperCase(),
        unidad: termino.toUpperCase(),
        descripcion: termino.toLowerCase(),
      })
      .leftJoinAndSelect('arh.images', 'arhImages')
      .getOne();
    }

    if(!archivo) throw new NotFoundException(`El registro con ${termino} no existe.`);

    return archivo;
  }

  async findOnePlane(termino:string){
    const {images = [], ...rest}= await this.findOne(termino);
    const archivo = {
      ...rest,
      images:images.map(img=>img.url)
    };

    return {ok:true, archivo}

  }

  async update(id: string, updateArchivoDto: UpdateArchivoDto, user:User) {
    const { images, ...toUpdate } = updateArchivoDto;
    const archivo = await this.archivoRepository.preload({
      id,
      ...toUpdate
    });

    if (!archivo) throw new NotFoundException(`El registro con ${id} no existe`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if (images) {
        await queryRunner.manager.delete(ArchivoImage, { archivo: { id } });
        archivo.images = images.map(image => 
          this.archivoImagenRepository.create({ url: image,user })
        )
      }


      archivo.user=user;
      await queryRunner.manager.save(archivo);
      await queryRunner.commitTransaction();
      await queryRunner.release();


      return this.findOnePlane(id);

    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleExceptions(error);
    }
  }

  async remove(id:string) {
    const archivo = await this.findOne(id);
    await this.archivoRepository.remove(archivo);
    return {ok:true,msg:'Archivo Eliminado...'};
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
