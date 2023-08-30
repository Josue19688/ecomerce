import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateAgenteDto } from './dto/create-agente.dto';
import { UpdateAgenteDto } from './dto/update-agente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Agente } from './entities/agente.entity';
import { DataSource, Repository } from 'typeorm';
import { AgenteImage } from './entities/agente-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.tdo';
import { validate as isUUID } from 'uuid';

@Injectable()
export class AgenteService {

  private readonly logger = new Logger('NovedadService')

  constructor(
    @InjectRepository(Agente)
    private readonly agenteRepository:Repository<Agente>,
    @InjectRepository(AgenteImage)
    private readonly agenteImagenRepository:Repository<AgenteImage>,
    private readonly dataSource:DataSource
  ){}
  async create(createAgenteDto: CreateAgenteDto,user:User) {
    try {
      const {images=[], ...agenteDetails}=createAgenteDto;
      const agente = this.agenteRepository.create({
        ...agenteDetails,
        images:images.map(image=>this.agenteImagenRepository.create({url:image})),
        user
      })

      await this.agenteRepository.save(agente);
      const agentes = {...agente, images};
      return {ok:true, agentes }
    } catch (error) {
      this.handleExceptions(error);
    }

  }

  async findAll(paginationDto:PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const agente = await this.agenteRepository.find({
      take:limit,
      skip:offset,
      relations:{
        images:true
      }
    })

    const agentes = agente.map(item=>({
      ...item,
      images:item.images.map(img=>img.url)
    }))

    return {ok:true, agentes};
  }

  async findOne(termino: string) {
    let agente:Agente;

    if(isUUID(termino)){
      agente = await this.agenteRepository.findOneBy({id:termino});
    }else{
      const  queryBuilder = this.agenteRepository.createQueryBuilder('nov');
      agente = await queryBuilder
      .where('UPPER(nombre)=:nombre or dpi=:dpi or telefono=:telefono or correo=:correo or igss=:igss or nit=:nit or grupo=:grupo or estado=:estado',{
        nombre: termino.toUpperCase(),
        dpi: termino.toLowerCase(),
        telefono: termino.toUpperCase(),
        correo: termino.toLowerCase(),
        igss: termino.toUpperCase(),
        nit: termino.toLowerCase(),
        grupo: termino.toLowerCase(),
        estado: termino.toLowerCase(),
      })
      .leftJoinAndSelect('nov.images', 'novImages')
      .getOne();
    }

    if(!agente) throw new NotFoundException(`El registro con ${termino} no existe.`);

    return agente;
  }

  async findOnePlane(termino:string){
    const {images = [], ...rest}= await this.findOne(termino);
    const agente = {
      ...rest,
      images:images.map(img=>img.url)
    };

    return {ok:true, agente}

  }


  async update(
    id: string, 
    updateAgenteDto: UpdateAgenteDto,
    user:User
    ) {
      const { images, ...toUpdate } = updateAgenteDto;
      const agente = await this.agenteRepository.preload({
        id,
        ...toUpdate
      });
  
      if (!agente) throw new NotFoundException(`El registro con ${id} no existe`);
  
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
  
      try {
  
        if (images) {
          await queryRunner.manager.delete(AgenteImage, { agente: { id } });
          agente.images = images.map(image => 
            this.agenteImagenRepository.create({ url: image,user })
          )
        }
  
  
        agente.user=user;
        await queryRunner.manager.save(agente);
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
    const agente = await this.findOne(id);
    await this.agenteRepository.remove(agente);
    return {ok:true,msg:'Agente Eliminado'};
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
