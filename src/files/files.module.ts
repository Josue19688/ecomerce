import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from 'src/products/products.module';
import { AuthModule } from 'src/auth/auth.module';
import { AgenteModule } from 'src/agente/agente.module';
import { NovedadModule } from 'src/novedad/novedad.module';
import { VisitaModule } from 'src/visita/visita.module';
import { ArchivoModule } from 'src/archivo/archivo.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports:[
    ProductsModule,
    AgenteModule,
    NovedadModule,
    VisitaModule,
    ArchivoModule,
    ConfigModule,
    AuthModule
  ]
})
export class FilesModule {}
