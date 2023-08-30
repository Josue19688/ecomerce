import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserImage } from './entities/user-image.entity';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.tdo';



@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService')

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserImage)
    private readonly userImageRepository:Repository<UserImage>,

    private readonly jwtService:JwtService,
    private readonly dataSource: DataSource,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {

      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user);
      delete user.password;


      return {
        ok:true,
        ...user,
        token:this.getJwtToken({id:user.id})
      }

    } catch (error) {
      this.handleExceptions(error);

    }

  }

  async login(loginUserDto: LoginUserDto) {


    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true,id:true,fullName:true,roles:true }
    });

    if (!user) throw new UnauthorizedException('Credenciales invalidas!!');
    if (user.isActive===false) throw new UnauthorizedException('Usuario inabilitado, comuniquese al departamento de seguirdad. EXT.418, para activarlo.');

    if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Credenciales invalidas!!');

    const {password:_, ...rest}=user;
    
    return {
     
      user: rest,
      token:this.getJwtToken({id:user.id})
    }



  }

  async checkAuthStatus(user:User){

    return {
      
      user:user,
      token:this.getJwtToken({id:user.id})
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit=100, offset = 0 } = paginationDto;
    const user = await this.userRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    })

    const usuarios =user.map(usuario => ({
      ...usuario,
      images: usuario.images.map(img => img.url)
    }))

    return {ok:true, usuarios};
  }


 

  
  async findOne(termino: string) {

    let user: User;

    if (isUUID(termino)) {
      user = await this.userRepository.findOneBy({ id: termino });
    } else {
      const queryBuilder = this.userRepository.createQueryBuilder('user');
      user = await queryBuilder
        .where('UPPER(email)=:email or UPPER(fullName)=:fullName', {
          title: termino.toUpperCase(),
          slug: termino.toLowerCase(),
        })
        .leftJoinAndSelect('user.images', 'userImages')
        .getOne();
    }

    if (!user) throw new NotFoundException(`El registro con ${termino} no existe.`);

    return user;
  }

  async update(id:string,updateUserDto:UpdateUserDto,user:User){

    const {images, ...toUpdate} = updateUserDto;

    const userDb =  await this.userRepository.preload({
      id,
      ...toUpdate
    })

    if (!userDb) throw new NotFoundException(`El registro con ${id} no existe`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if (images) {
        await queryRunner.manager.delete(UserImage, { user: { id } });
        userDb.images = images.map(image => 
          this.userImageRepository.create({ url: image})
        )
      }

      await queryRunner.manager.save(userDb);
      await queryRunner.commitTransaction();
      await queryRunner.release();


      return this.findOnePlane(id);
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleExceptions(error);
    }

  }


  async findOnePlane(termino: string) {
    const { images = [], ...rest } = await this.findOne(termino);
    return {
      ...rest,
      images: images.map(image => image.url)
    }
  }


  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return {ok:true,msg:'Usuario Eliminada'};
  }

  private getJwtToken(payload:JwtPayload){

    const token = this.jwtService.sign(payload);
    return token;

  }

  private handleExceptions(error: any): never {
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
