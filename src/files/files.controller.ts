import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Res, UploadedFiles, ParseUUIDPipe, Body } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { diskStorage } from 'multer';
import { fileName, fileFilter } from './helpers';
import { ConfigService } from '@nestjs/config';
import { fileFilters } from './helpers/fileFilter';
import { fileNames } from './helpers/fileName';
import { ProductsService } from 'src/products/products.service';
import { User } from 'src/auth/entities/user.entity';
import { Auth, GetUser } from 'src/auth/decorators';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { AgenteService } from 'src/agente/agente.service';
import { NovedadService } from 'src/novedad/novedad.service';
import { VisitaService } from 'src/visita/visita.service';
import { ArchivoService } from 'src/archivo/archivo.service';
import { PostService } from 'src/post/post.service';
import { VacanteService } from 'src/vacante/vacante.service';
import { GenericDto } from './dto/genericDto';

@ApiTags('Files')
@Controller('files')
//@Auth()
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
    private readonly productService: ProductsService,
    private readonly agenteService: AgenteService,
    private readonly novedadService: NovedadService,
    private readonly visitaService: VisitaService,
    private readonly archivoService: ArchivoService,
    private readonly postService: PostService,
    private readonly authService: AuthService,
    private readonly vacanteService:VacanteService
  ) { }


  /**
   * IMPLEMENTAR PARA SUBIR IMAGENES POR COLLECIONES
   */

  @Get('uploads/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
  }




  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/productos',
      filename: fileName
    })
  }))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,

  ) {

    if (!file) throw new BadRequestException(`El archivo no puede ser vacio`);

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;


    return { secureUrl };
  }



  @Post('product/images')
  @Auth()
  @UseInterceptors(FilesInterceptor('files', undefined, {
    fileFilter: fileFilters,
    storage: diskStorage({
      destination: './static/productos',
      filename: fileNames
    })
  }))
  uploadProductImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {

    if (!files.length) throw new BadRequestException('File is required, only accepted images');

    const secureUrls = files.map(files => `${this.configService.get('HOST_API')}/files/product/${files.filename}`);

    const arrayImages = secureUrls;

    this.productService.update(id, { images: arrayImages }, user)


    return {
      secureUrls
    }

  }


  /**
   * Metodo general para subir imagenes o archivos por collecion o entidad
   * el cual se reutilizara segun necesidades
   * @param files 
   * @param id 
   * @param modelo 
   * @param user 
   * @returns 
   */
  @Post('uploads')
  @Auth()
  @UseInterceptors(FilesInterceptor('files', undefined, {
    fileFilter: fileFilters,
    storage: diskStorage({
      destination: './static/uploads',
      filename: fileNames
    })
  }))
  uploadModelImages(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('id', ParseUUIDPipe) id: string,
    @Body('modelo') modelo: string,
    @GetUser() user: User
  ) {

    const modelos = ['usuario', 'producto', 'novedad', 'agente', 'visita', 'archivo','post', 'vacante','candidato'];

    if (!modelos.includes(modelo)) throw new BadRequestException('Models NotFound...');

    if (!files.length) throw new BadRequestException('File is required, only accepted images');
    let secureUrls: any[] = [];

    secureUrls = files.map(files => `${this.configService.get('HOST_API')}/files/uploads/${files.filename}`);
    const arrayImages = secureUrls;

    switch (modelo) {
      case 'usuario':
        this.authService.update(id, { images: arrayImages }, user);
        break;
      case 'producto':
        this.productService.update(id, { images: arrayImages }, user)
        break;
      case 'agente':
        this.agenteService.update(id, { images: arrayImages }, user)
        break;
      case 'novedad':
        this.novedadService.update(id, { images: arrayImages }, user)
        break;
      case 'visita':
        this.visitaService.update(id, { images: arrayImages }, user)
        break;
      case 'archivo':
        this.archivoService.update(id, { images: arrayImages }, user)
        break;
      case 'post':
        this.postService.update(id, { images: arrayImages })
        break;
      case 'vacante':
        this.vacanteService.update(id, { imagen: arrayImages }, user)
        break;
      case 'candidato':
        this.vacanteService.actualizarDocsCandidato(id, { candidatos: arrayImages })
        break;
      default:
        'No se encontro el modelo';
    }

    return {
      secureUrls
    }

  }

  
  /**
   * Metodo general para subir imagenes o archivos por collecion o entidad
   * el cual se reutilizara segun necesidades
   * @param files 
   * @param id 
   * @param modelo 
   * @param user 
   * @returns 
   */
  @Post('uploads/todo')
  @UseInterceptors(FilesInterceptor('files', undefined, {
    fileFilter: fileFilters,
    storage: diskStorage({
      destination: './static/uploads',
      filename: fileNames
    })
  }))
  subirDataUploads(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() entityDto:any,
  ) {

    const modelos = [ 'vacante','candidato'];

    const {modelo, id, ...details } = entityDto;

    if (!modelos.includes(modelo)) throw new BadRequestException('Models NotFound...');

    if (!files.length) throw new BadRequestException('File is required, only accepted images');
    let documents: any[] = [];

    documents = files.map(files => `${this.configService.get('HOST_API')}/files/uploads/${files.filename}`);
    const arrayData = {...details, documents};

  
    switch (modelo) {
      // case 'vacante':
      //   this.vacanteService.update(id, { imagen: arrayImages }, user)
      //   break;
      case 'candidato':
        this.vacanteService.actualizarDocsCandidato(id, {candidatos:arrayData} )
        break;
      default:
        'No se encontro el modelo';
    }

    return {
      arrayData
    }

  }


}
