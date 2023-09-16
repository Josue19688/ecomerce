import { Module } from '@nestjs/common';
import { VisitaService } from './visita.service';
import { VisitaController } from './visita.controller';

import { Visita } from './entities/visita.entity';
import { AuthModule } from 'src/auth/auth.module';
import { VisitaImage } from './entities/visita-image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from 'src/email/email.module';

@Module({
  controllers: [VisitaController],
  providers: [VisitaService],
  imports:[
    TypeOrmModule.forFeature([Visita,VisitaImage]),
    AuthModule,
    ConfigModule,
    EmailModule
  ],
  exports:[
    VisitaService,
    TypeOrmModule
  ]
})
export class VisitaModule {}
