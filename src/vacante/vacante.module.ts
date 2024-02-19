import { Module } from '@nestjs/common';
import { VacanteService } from './vacante.service';
import { VacanteController } from './vacante.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacante } from './entities/vacante.entity';
import { Candidato } from './entities/candidato.entity';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  controllers: [VacanteController],
  providers: [VacanteService],
  imports:[
    TypeOrmModule.forFeature([
      Vacante, Candidato
    ]),
    AuthModule,
    EmailModule
  ],
  exports:[
    VacanteService,
    TypeOrmModule
  ]
})
export class VacanteModule {}
