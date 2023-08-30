import { Module } from '@nestjs/common';
import { ArchivoService } from './archivo.service';
import { ArchivoController } from './archivo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Archivo } from './entities/archivo.entity';
import { ArchivoImage } from './entities/archivo-image.entity';

@Module({
  controllers: [ArchivoController],
  providers: [ArchivoService],
  imports:[
    TypeOrmModule.forFeature([Archivo,ArchivoImage]),
    AuthModule
  ],
  exports:[
    ArchivoService,
    TypeOrmModule
  ]
})
export class ArchivoModule {}
