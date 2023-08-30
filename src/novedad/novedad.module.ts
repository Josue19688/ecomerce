import { Module } from '@nestjs/common';
import { NovedadService } from './novedad.service';
import { NovedadController } from './novedad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Novedad } from './entities/novedad.entity';
import { NovedadImage } from './entities/novedad-image.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [NovedadController],
  providers: [NovedadService],
  imports:[
    TypeOrmModule.forFeature([
      Novedad,NovedadImage
    ]),
    AuthModule
  ],
  exports:[
    NovedadService,
    TypeOrmModule
  ]
})
export class NovedadModule {}
