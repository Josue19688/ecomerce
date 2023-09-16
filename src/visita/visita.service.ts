import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateVisitaDto } from './dto/create-visita.dto';
import { UpdateVisitaDto } from './dto/update-visita.dto';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.tdo';
import { InjectRepository } from '@nestjs/typeorm';
import { Visita } from './entities/visita.entity';
import { DataSource, Repository } from 'typeorm';
import { VisitaImage } from './entities/visita-image.entity';
import { validate as isUUID } from 'uuid';
import { botLogs } from 'src/middlewares/log';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class VisitaService {
  private readonly logger = new Logger('VisitaService')

  constructor(
    @InjectRepository(Visita)
    private readonly visitaRepository:Repository<Visita>,
    @InjectRepository(VisitaImage)
    private readonly visitaImageRepository:Repository<VisitaImage>,

    private readonly dataSource:DataSource,
    private readonly emailService:EmailService,
  ){}


  async create(createVisitaDto: CreateVisitaDto,user:User) {
    try {
      const {images=[], ...visitaDetails}=createVisitaDto;
      const visita = this.visitaRepository.create({
        ...visitaDetails,
        images:images.map(image=>this.visitaImageRepository.create({url:image})),
        user
      })

      await this.visitaRepository.save(visita);
      const visitas = {...visita, images};



      const data =`<b>Tipo Visita </b> : ${visita.tipo}, \n<b>Ingreso por  </b>: ${visita.puesto},\n<b>Nombres </b> : ${visita.nombre}, \n<b>Dpi </b> : ${visita.dpi},\n<b>Placas </b> :${visita.placa},\n<b>Empresa </b> :${visita.empresa},\n<b>Empleado Recibe </b> : ${visita.empleado},\n<b>Fechas  </b> : ${visita.fechas},\n<b>Descripcion </b>:${visita.descripcion}`;
    
      botLogs(data);
      return {ok:true, visitas }
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto:PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const visita = await this.visitaRepository.find({
      take:limit,
      skip:offset,
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

  async findAllVisitas(userId:string) {
    
    const visita = await this.visitaRepository.find({
      where:{
        'user':{
          'id':userId
        }
      }
    });

    
    const visitas = visita.map(item=>({
      ...item,
      images:item.images.map(img=>img.url)
    }))

    return {ok:true, visitas};
  
    
  }

  async findOnePlane(termino:string){
    const {images = [], ...rest}= await this.findOne(termino);
    const visita = {
      ...rest,
      images:images.map(img=>img.url)
    };

    return {ok:true, visita}

  }

  /**
   * Para autorizacion de visitas y permitir el ingreso a las instalaciones
   */
  async findAllAutorizationAdmin(){
    const visitas = await this.visitaRepository.find({
      where:{
        autorizacion_admin:false
      }
    })

    return {ok:true, visitas};
  }

  async findAllAutorizationSeguridad(){
    const visitas = await this.visitaRepository.find({
      where:{
        autorizacion_seguridad:false
      }
    })

    return {ok:true, visitas};
  }

  async findOne(termino: string) {
    let visita:Visita;

    if(isUUID(termino)){
      visita = await this.visitaRepository.findOneBy({id:termino});
    }else{
      const  queryBuilder = this.visitaRepository.createQueryBuilder('vis');
      visita = await queryBuilder
      .where('UPPER(tipo)=:tipo or puesto=:puesto or empresa=:empresa or empleado=:empleado  or descripcion=:descripcion ',{
        tipo: termino.toUpperCase(),
        puesto: termino.toLowerCase(),
        empresa: termino.toUpperCase(),
        empleado: termino.toUpperCase(),
        descripcion: termino.toLowerCase(),
      })
      .leftJoinAndSelect('vis.images', 'visImages')
      .getOne();
    }

    if(!visita) throw new NotFoundException(`El registro con ${termino} no existe.`);

    return visita;
  }

 

  async update(id: string, updateVisitaDto: UpdateVisitaDto, user:User) {
    const { images, ...toUpdate } = updateVisitaDto;
    const visita = await this.visitaRepository.preload({
      id,
      ...toUpdate
    });

    if (!visita) throw new NotFoundException(`El registro con ${id} no existe`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if (images) {
        await queryRunner.manager.delete(VisitaImage, { visita: { id } });
        visita.images = images.map(image => 
          this.visitaImageRepository.create({ url: image,user })
        )
      }


      visita.user=user;
      await queryRunner.manager.save(visita);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      const visitas = this.findOnePlane(id);
      
    
      if((await visitas).visita.autorizacion_admin==true ){
        const data =`<b>Autorización Administración: </b>${user.fullName},\n<b>Tipo Visita </b> : ${(await visitas).visita.tipo}, \n<b>Ingreso por  </b>: ${(await visitas).visita.puesto},\n<b>Nombres </b> : ${(await visitas).visita.nombre}, \n<b>Dpi </b> : ${(await visitas).visita.dpi},\n<b>Placas </b> :${(await visitas).visita.placa},\n<b>Empresa </b> :${(await visitas).visita.empresa},\n<b>Empleado Recibe </b> : ${(await visitas).visita.empleado},\n<b>Fechas  </b> : ${(await visitas).visita.fechas},\n<b>Descripcion </b>:${(await visitas).visita.descripcion}`;
        botLogs(data);
      }

      if((await visitas).visita.autorizacion_seguridad==true ){
        const data =`<b>Autorización Seguridad: </b>${user.fullName},\n<b>Tipo Visita </b> : ${(await visitas).visita.tipo}, \n<b>Ingreso por  </b>: ${(await visitas).visita.puesto},\n<b>Nombres </b> : ${(await visitas).visita.nombre}, \n<b>Dpi </b> : ${(await visitas).visita.dpi},\n<b>Placas </b> :${(await visitas).visita.placa},\n<b>Empresa </b> :${(await visitas).visita.empresa},\n<b>Empleado Recibe </b> : ${(await visitas).visita.empleado},\n<b>Fechas  </b> : ${(await visitas).visita.fechas},\n<b>Descripcion </b>:${(await visitas).visita.descripcion}`;
        botLogs(data);
      }

      
     

      return this.findOnePlane(id);

    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleExceptions(error);
    }
  }

  async updateAutorizacion(id: string, updateVisitaDto: UpdateVisitaDto, user:User) {
    const { images, ...toUpdate } = updateVisitaDto;
    const visita = await this.visitaRepository.preload({
      id,
      ...toUpdate
    });

    if (!visita) throw new NotFoundException(`El registro con ${id} no existe`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

    

      
      await queryRunner.manager.save(visita);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      const visitas = this.findOnePlane(id);
      
      const {email} = (await visitas).visita.user;
      const {empresa} = (await visitas).visita;
      const data={
        to:email,
        subject:'Autorización de Visitas',
        template:'auth-visita',
        url:empresa
      };

      
      if((await visitas).visita.autorizacion_admin==true && (await visitas).visita.autorizacion_seguridad==true){
        await this.emailService.sendEmail(data);
      }
      
    
      if((await visitas).visita.autorizacion_admin==true ){
        const data =`<b>Autorización Administración: </b>${user.fullName},\n<b>Tipo Visita </b> : ${(await visitas).visita.tipo}, \n<b>Ingreso por  </b>: ${(await visitas).visita.puesto},\n<b>Nombres </b> : ${(await visitas).visita.nombre}, \n<b>Dpi </b> : ${(await visitas).visita.dpi},\n<b>Placas </b> :${(await visitas).visita.placa},\n<b>Empresa </b> :${(await visitas).visita.empresa},\n<b>Empleado Recibe </b> : ${(await visitas).visita.empleado},\n<b>Fechas  </b> : ${(await visitas).visita.fechas},\n<b>Descripcion </b>:${(await visitas).visita.descripcion}`;
        botLogs(data);
      }

      if((await visitas).visita.autorizacion_seguridad==true ){
        const data =`<b>Autorización Seguridad: </b>${user.fullName},\n<b>Tipo Visita </b> : ${(await visitas).visita.tipo}, \n<b>Ingreso por  </b>: ${(await visitas).visita.puesto},\n<b>Nombres </b> : ${(await visitas).visita.nombre}, \n<b>Dpi </b> : ${(await visitas).visita.dpi},\n<b>Placas </b> :${(await visitas).visita.placa},\n<b>Empresa </b> :${(await visitas).visita.empresa},\n<b>Empleado Recibe </b> : ${(await visitas).visita.empleado},\n<b>Fechas  </b> : ${(await visitas).visita.fechas},\n<b>Descripcion </b>:${(await visitas).visita.descripcion}`;
        botLogs(data);
      }

      
     

      return this.findOnePlane(id);

    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleExceptions(error);
    }
  }


  async remove(id: string) {
    const visita = await this.findOne(id);
    await this.visitaRepository.remove(visita);
    return {ok:true,msg:'Visita Eliminada'};
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
