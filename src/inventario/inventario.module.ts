import { Module } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { Inventario } from './entities/inventario.entity';
import { InventarioImage } from './entities/inventario-image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from 'src/email/email.module';

@Module({
  controllers: [InventarioController],
  providers: [InventarioService],
  imports:[
    
    AuthModule,
    ConfigModule,
    EmailModule
  ],
  exports:[
    InventarioService,
    TypeOrmModule
  ]
})
export class InventarioModule {}
