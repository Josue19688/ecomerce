import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { AuthwebsocketsModule } from './authwebsockets/authwebsockets.module';
import { SearchModule } from './search/search.module';
import { NovedadModule } from './novedad/novedad.module';
import { VisitaModule } from './visita/visita.module';
import { AgenteModule } from './agente/agente.module';
import { ArchivoModule } from './archivo/archivo.module';
import { EmailModule } from './email/email.module';
import { PostModule } from './post/post.module';
import { MantenimientoModule } from './mantenimiento/mantenimiento.module';
import { InventarioModule } from './inventario/inventario.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      port: +process.env.DB_PORT,
      database: process.env.NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities:true,
      synchronize:true, ///solo para desarrollo en produccion cambiar a false
    }),
     
    ProductsModule,
    CommonModule,
    FilesModule,
    AuthModule,
    SeedModule,
    AuthwebsocketsModule,
    SearchModule,
    NovedadModule,
    VisitaModule,
    AgenteModule,
    ArchivoModule,
    EmailModule,
    PostModule,
  ],

})
export class AppModule {}
