import { Module } from '@nestjs/common';
import { MantenimientoService } from './mantenimiento.service';
import { MantenimientoController } from './mantenimiento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from 'src/email/email.module';
import { Mantenimiento } from './entities/mantenimiento.entity';

@Module({
  controllers: [MantenimientoController],
  providers: [MantenimientoService],
  imports:[
    TypeOrmModule.forFeature([Mantenimiento]),
    AuthModule,
    ConfigModule,
    EmailModule
  ],
  exports:[
    MantenimientoService,
    TypeOrmModule
  ]
})
export class MantenimientoModule {}
