import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { ProductsModule } from 'src/products/products.module';
import { AuthModule } from 'src/auth/auth.module';
import { NovedadModule } from 'src/novedad/novedad.module';
import { AgenteModule } from 'src/agente/agente.module';
import { ArchivoModule } from 'src/archivo/archivo.module';
import { VisitaModule } from 'src/visita/visita.module';
import { VacanteModule } from 'src/vacante/vacante.module';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [
    ProductsModule,
    NovedadModule,
    AgenteModule,
    ArchivoModule,
    VisitaModule,
    VacanteModule,
    AuthModule,
  ]
})
export class SearchModule {}
