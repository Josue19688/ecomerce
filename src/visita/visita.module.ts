import { Module } from '@nestjs/common';
import { VisitaService } from './visita.service';
import { VisitaController } from './visita.controller';

import { Visita } from './entities/visita.entity';
import { AuthModule } from 'src/auth/auth.module';
import { VisitaImage } from './entities/visita-image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [VisitaController],
  providers: [VisitaService],
  imports:[
    TypeOrmModule.forFeature([Visita,VisitaImage]),
    AuthModule
  ],
  exports:[
    VisitaService,
    TypeOrmModule
  ]
})
export class VisitaModule {}
