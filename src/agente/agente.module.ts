import { Module } from '@nestjs/common';
import { AgenteService } from './agente.service';
import { AgenteController } from './agente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agente } from './entities/agente.entity';
import { AgenteImage } from './entities/agente-image.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [AgenteController],
  providers: [AgenteService],
  imports:[
    TypeOrmModule.forFeature([
      Agente, AgenteImage
    ]),
    AuthModule
  ],
  exports:[
    AgenteService,
    TypeOrmModule
  ]
})
export class AgenteModule {}
