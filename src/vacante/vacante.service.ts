import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateVacanteDto } from './dto/create-vacante.dto';
import { UpdateVacanteDto } from './dto/update-vacante.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Vacante } from './entities/vacante.entity';
import { Candidato } from './entities/candidato.entity';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.tdo';
import { isUUID } from 'class-validator';

@Injectable()
export class VacanteService {

  private readonly logger = new Logger('VacanteService')
  constructor(
    @InjectRepository(Vacante)
    private readonly vacanteRepository: Repository<Vacante>,
    @InjectRepository(Candidato)
    private readonly candidatoRepository: Repository<Candidato>,

    private readonly dataSource: DataSource,
  ) { }


  async create(createVacanteDto: CreateVacanteDto, user: User) {
    try {


      const { candidatos = [], ...vacanteDetails } = createVacanteDto;
      const vacante = this.vacanteRepository.create({
        ...vacanteDetails,
        //candidatos: candidatos.map((data:any)=> this.candidatoRepository.create({nombre:data.nombre, email:data.email, telefono:data.telefono})),
        user
      });
      await this.vacanteRepository.save(vacante);
      return { ...vacante, candidatos };

    } catch (error) {

      this.handleExceptions(error);
    }
  }

  async findAll() {
    const vacantes = await this.vacanteRepository.find({
      relations: {
        candidatos: true
      }
    })

    return vacantes;
  }

  async findAllTen(paginationDto: PaginationDto) {
    const { limit = 12, offset = 0 } = paginationDto;
    const vacantes = await this.vacanteRepository.find({
      take: limit,
      skip: offset,
      relations: {
        candidatos: true
      }
    })

    return vacantes;
  }

  async findAllVacantes(userId: string) {

    const vacante = await this.vacanteRepository.find({
      where: {
        'user': {
          'id': userId
        }
      }
    });

    return { ok: true, vacante };
  }


  async findOne(termino: string) {

    let vacante: Vacante;

    if (isUUID(termino)) {
      vacante = await this.vacanteRepository.findOneBy({ id: termino });
    } else {
      const queryBuilder = this.vacanteRepository.createQueryBuilder('vac');
      vacante = await queryBuilder
        .where('titulo=:titulo or slug=:slug or empresa=:empresa or ubicacion=:ubicacion or salario=:salario or contrato=:contrato or estado=:estado or descripcion=:descripcion', {
          titulo: termino.toUpperCase(),
          slug: termino.toLowerCase(),
          empresa: termino.toLowerCase(),
          ubicacion: termino.toLowerCase(),
          salario: termino.toLowerCase(),
          contrato: termino.toLowerCase(),
          estado: termino.toLowerCase(),
          descripcion: termino.toLowerCase(),

        })
        .leftJoinAndSelect('vac.candidatos', 'vacCandidato')
        .getOne();
    }

    if (!vacante) throw new NotFoundException(`El registro con ${termino} no existe.`);

    return vacante;
  }


  async findOnePlane(termino: string) {
    const vacantes = await this.findOne(termino);


    return { ok: true, vacantes }

  }

  async update(
    id: string,
    updateVacanteDto: UpdateVacanteDto,
    user: User
  ) {

    const { candidatos, ...toUpdate } = updateVacanteDto;
    const vacante = await this.vacanteRepository.preload({
      id,
      ...toUpdate
    });

    if (!vacante) throw new NotFoundException(`El registro con ${id} no existe`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if (candidatos) {
        //await queryRunner.manager.delete(Candidato, { candidatos: { id } }); //habilitamos si primero queremos borrar datos anteriores
        // vacante.candidatos = candidatos.map((data:any)=> 
        //   this.candidatoRepository.create({nombre:data.nombre, email:data.email, telefono:data.telefono})
        // )
      }


      vacante.user = user;
      await queryRunner.manager.save(vacante);
      await queryRunner.commitTransaction();
      await queryRunner.release();


      return this.findOnePlane(id);

    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleExceptions(error);
    }
  }


  async createVacante(
    createVacanteDto: CreateVacanteDto, 
    user: User
    ) {
    try {

 console.log(createVacanteDto)

      const vacante = this.vacanteRepository.create({
        titulo:createVacanteDto.titulo,
        slug:createVacanteDto.titulo,
        empresa:createVacanteDto.empresa,
        ubicacion:createVacanteDto.ubicacion,
        salario:createVacanteDto.salario,
        contrato:createVacanteDto.contrato,
        estado:'creado',
        descripcion:createVacanteDto.descripcion,
        skills:createVacanteDto.skills,
        imagen:createVacanteDto.imagen,
        user
      });
      await this.vacanteRepository.save(vacante);
      return vacante;

    } catch (error) {

      this.handleExceptions(error);
    }
  }


  async actualizarDocsCandidato(
    id: string,
    c: any
  ) {

    const { candidatos, ...toUpdate } = c;
    const vacante = await this.vacanteRepository.preload({
      id,
      ...toUpdate
    });

    if (!vacante) throw new NotFoundException(`El registro con ${id} no existe`);

    try {
      const candidato = this.candidatoRepository.create({
        nombre: candidatos.nombre,
        email: candidatos.email,
        telefono: candidatos.telefono,
        documentos: candidatos.documents, vacante
      })

      const respuesta = await this.candidatoRepository.save(candidato);
      return respuesta;

    } catch (error) {
      this.handleExceptions(error);
    }




  }




  async remove(id: string) {
    const vacante = await this.findOne(id);
    await this.vacanteRepository.remove(vacante);
    return { ok: true, msg: 'Registro  Eliminado' };
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
