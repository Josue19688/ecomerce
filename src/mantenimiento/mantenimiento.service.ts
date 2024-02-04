import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateMantenimientoDto } from './dto/create-mantenimiento.dto';
import { UpdateMantenimientoDto } from './dto/update-mantenimiento.dto';
import { DataSource, Repository } from 'typeorm';
import { Mantenimiento } from './entities/mantenimiento.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.tdo';
import { validate as isUUID } from 'uuid';

@Injectable()
export class MantenimientoService {
  private readonly logger = new Logger('NovedadService')

  
  constructor(
    @InjectRepository(Mantenimiento)
    private readonly mantenimientoRepository:Repository<Mantenimiento>,
    private readonly dataSource:DataSource
  ){}

  async create(createMantenimientoDto: CreateMantenimientoDto, user:User) {
    try {
      const {inventario, ...mantenimientoDetails} = createMantenimientoDto;
      const mantenimiento = this.mantenimientoRepository.create({
        ...mantenimientoDetails,
        user,
        inventario
      });

      await this.mantenimientoRepository.save(mantenimiento);
      const mantenimientos = {...mantenimiento};
      return {ok:true, mantenimientos};
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto:PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const mantenimiento = await this.mantenimientoRepository.find({
      take:limit,
      skip:offset,
    })

    const matenimientos = mantenimiento.map(item=>({
      ...item
    }))

    return {ok:true, matenimientos};
  }

  async findOne(termino:string) {
    let mantenimiento:Mantenimiento;

    if(isUUID(termino)){
      mantenimiento = await this.mantenimientoRepository.findOneBy({id:termino});
    }else{
      const  queryBuilder = this.mantenimientoRepository.createQueryBuilder('nov');
      mantenimiento = await queryBuilder
      .where('division=:division or sede=:sede or estado=:estado or tipoServicio=:tipoServicio or tecnico=:tecnico or descripcion=:descripcion',{
        division: termino.toLowerCase(),
        sede: termino.toLowerCase(),
        estado: termino.toUpperCase(),
        tipoServicio: termino.toLowerCase(),
        tecnico:termino.toLowerCase(),
        descripcion: termino.toLowerCase()
      })
      .leftJoinAndSelect('nov.images', 'novImages')
      .getOne();
    }

    if(!mantenimiento) throw new NotFoundException(`El registro con ${termino} no existe.`);

    return mantenimiento;
  }
  
  async findOnePlane(termino:string){
    const { ...rest}= await this.findOne(termino);
    const agente = {
      ...rest,
    };

    return {ok:true, agente}

  }

  async update(id: string, updateMantenimientoDto: UpdateMantenimientoDto, user:User) {
    const {inventario, ...toUpdate } = updateMantenimientoDto;
    const mantenimiento = await this.mantenimientoRepository.preload({
      id,
      ...toUpdate,
      inventario
    });

    if (!mantenimiento) throw new NotFoundException(`El registro con ${id} no existe`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      
      mantenimiento.user=user;
      await queryRunner.manager.save(mantenimiento);
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
    const mantenimiento = await this.findOne(id);
    await this.mantenimientoRepository.remove(mantenimiento);
    return {ok:true,msg:'Registro Eliminado'};
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
