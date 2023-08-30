import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateNovedadDto } from './dto/create-novedad.dto';
import { UpdateNovedadDto } from './dto/update-novedad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Novedad } from './entities/novedad.entity';
import { DataSource, Repository } from 'typeorm';
import { NovedadImage } from './entities/novedad-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.tdo';
import { validate as isUUID } from 'uuid';
import { botLogs } from 'src/middlewares/log';


@Injectable()
export class NovedadService {
  private readonly logger = new Logger('NovedadService')

  constructor(
    @InjectRepository(Novedad)
    private readonly novedadRepository:Repository<Novedad>,
    @InjectRepository(NovedadImage)
    private readonly novedadImageRepository:Repository<NovedadImage>,
    

    private readonly dataSource:DataSource
  ){}

  async create(createNovedadDto: CreateNovedadDto,user:User) {
    try {
      const {images=[], ...novedadDetails}=createNovedadDto;
      const novedad = this.novedadRepository.create({
        ...novedadDetails,
        images:images.map(image=>this.novedadImageRepository.create({url:image})),
        user
      })

      await this.novedadRepository.save(novedad);
      const novedades = {...novedad, images};

      const data =`<b>Tipo Novedad </b> : ${novedades.tipo}, \n<b>Nombres </b> : ${novedades.nombre}, \n<b>Dpi </b> : ${novedades.dpi},\n<b>Placas </b> :${novedades.placa},\n<b>Fecha </b> : ${novedades.fecha},\n<b>Hora </b> : ${novedades.hora},\n<b>Puesto  </b>: ${novedades.puesto},\n<b>Preliminar </b> : ${novedades.preliminar},\n<b>Descripcion </b>:${novedades.descripcion}`;
    
      botLogs(data);
      return {ok:true, novedades }
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto:PaginationDto) {
    const { limit=50 , offset  } = paginationDto;
    const novedad = await this.novedadRepository.find({
      take:limit,
      skip:offset,
      relations:{
        images:true
      },
      order:{
        createdAt:"DESC"
      }
    })

    const novedades = novedad.map(item=>({
      ...item,
      images:item.images.map(img=>img.url)
    }))

    return {ok:true, novedades};
  }

  async findOne(termino: string) {
    let novedad:Novedad;

    if(isUUID(termino)){
      novedad = await this.novedadRepository.findOneBy({id:termino});
    }else{
      const  queryBuilder = this.novedadRepository.createQueryBuilder('nov');
      novedad = await queryBuilder
      .where('UPPER(tipo)=:tipo or puesto=:puesto or preliminar=:preliminar or descripcion=:descripcion ',{
        tipo: termino.toUpperCase(),
        puesto: termino.toLowerCase(),
        preliminar: termino.toUpperCase(),
        descripcion: termino.toLowerCase(),
        nombre: termino.toUpperCase(),
        dpi: termino.toLowerCase(),
        placa: termino.toLowerCase(),
      })
      .leftJoinAndSelect('nov.images', 'novImages')
      .getOne();
    }

    if(!novedad) throw new NotFoundException(`El registro con ${termino} no existe.`);

    return novedad;

  }


  async findOnePlane(termino:string){
    const {images = [], ...rest}= await this.findOne(termino);
    const novedad = {
      ...rest,
      images:images.map(img=>img.url)
    };

    return {ok:true, novedad}

  }

  async update(
    id: string, 
    updateNovedadDto: UpdateNovedadDto ,
    user:User
    ) {
   
    const { images, ...toUpdate } = updateNovedadDto;
    const novedad = await this.novedadRepository.preload({
      id,
      ...toUpdate
    });

    if (!novedad) throw new NotFoundException(`El registro con ${id} no existe`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if (images) {
        await queryRunner.manager.delete(NovedadImage, { novedad: { id } });
        novedad.images = images.map(image => 
          this.novedadImageRepository.create({ url: image,user })
        )
      }


      novedad.user=user;
      await queryRunner.manager.save(novedad);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      const novedades = this.findOnePlane(id);
      const data =`<b>Tipo Novedad </b>: ${(await novedades).novedad.tipo}, \n<b>Nombres </b>: ${(await novedades).novedad.nombre}, \n<b>Dpi </b>: ${(await novedades).novedad.dpi},\n<b>Placas </b>:${(await novedades).novedad.placa},\n<b>Fecha </b>: ${(await novedades).novedad.fecha},\n<b>Hora </b>: ${(await novedades).novedad.hora},\n<b>Puesto </b>: ${(await novedades).novedad.puesto},\n<b>Preliminar </b>: ${(await novedades).novedad.preliminar},\n<b>Descripcion</b>:${(await novedades).novedad.descripcion}`;
    
      botLogs(data);
      return this.findOnePlane(id);

    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const novedad = await this.findOne(id);
    await this.novedadRepository.remove(novedad);
    return {ok:true,msg:'Novedad Eliminada'};
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
