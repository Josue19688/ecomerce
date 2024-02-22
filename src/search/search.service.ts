import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agente } from 'src/agente/entities/agente.entity';
import { Archivo } from 'src/archivo/entities/archivo.entity';
import { User } from 'src/auth/entities/user.entity';
import { GraficaModeloDto } from 'src/common/dto/graficaModelo.tdo';
import { SearchDto } from 'src/common/dto/search.dto';
import { SearchFindAllDto } from 'src/common/dto/searchFindAll.dto';
import { SearchTerminoDto } from 'src/common/dto/searchTermino.dto';
import { Novedad } from 'src/novedad/entities/novedad.entity';

import { Product, ProductImage } from 'src/products/entities';
import { Candidato } from 'src/vacante/entities/candidato.entity';
import { Vacante } from 'src/vacante/entities/vacante.entity';
import { Visita } from 'src/visita/entities/visita.entity';
import { ArrayContains, Between, Like, Repository } from 'typeorm';

@Injectable()
export class SearchService {


  private readonly logger = new Logger('ProductsService')
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Novedad)
    private readonly novedadRepository: Repository<Novedad>,
    @InjectRepository(Visita)
    private readonly visitaRepository: Repository<Visita>,
    @InjectRepository(Agente)
    private readonly agenteRepository: Repository<Agente>,
    @InjectRepository(Archivo)
    private readonly archivoRepository: Repository<Archivo>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Vacante)
    private readonly vacanteRepository: Repository<Vacante>,
    @InjectRepository(Candidato)
    private readonly candidatoRepository: Repository<Candidato>,
  ) { }




  /**
   * BUSQUEDA DE DATOS O FILTRADO POR FECHAS Y MODELOS
   * @param searchDto 
   * @returns 
   */

  async findAllModelsDate(searchDto: SearchDto) {
    const { inicio, fin, modelo } = searchDto;

    const modelos = ['usuario', 'producto', 'novedad', 'agente', 'visita', 'archivo', 'vacante', 'candidato'];

    if (!modelos.includes(modelo)) throw new BadRequestException('Models NotFound...');

    let data: any[] = [];

    switch (modelo) {
      case 'producto':
        const products = await this.productRepository.find({
          where: {
            createdAt: Between(
              new Date(inicio),
              new Date(fin)
            ),
          },
          relations: {
            images: true
          }
        })

        data = products.map(product => ({
          ...product,
          images: product.images.map(img => img.url)
        }))
        break;
      case 'usuario':
        data = await this.userRepository.find({
          where: {
            createdAt: Between(
              new Date(inicio),
              new Date(fin)
            ),
          },
          relations: {
            images: true
          }
        })
        break;
      case 'novedad':
        data = await this.novedadRepository.find({
          where: {
            fecha: Between(
              new Date(inicio),
              new Date(fin)
            ),
          },
          relations: {
            images: true
          }
        })
        break;
      case 'visita':
        data = await this.visitaRepository.find({
          where: {
            createdAt: Between(
              new Date(inicio),
              new Date(fin)
            ),
          },
          relations: {
            images: true
          }
        })
        break;
      case 'agente':
        data = await this.agenteRepository.find({
          where: {
            createdAt: Between(
              new Date(inicio),
              new Date(fin)
            ),
          },
          relations: {
            images: true
          }
        })
        break;
      case 'archivo':
        data = await this.archivoRepository.find({
          where: {
            createdAt: Between(
              new Date(inicio),
              new Date(fin)
            ),
          },
          relations: {
            images: true
          }
        })
        break;
      case 'vacante':
        data = await this.vacanteRepository.find({
          where: {
            createdAt: Between(
              new Date(inicio),
              new Date(fin)
            ),
          },
          relations: {
            candidatos: true
          }
        })
        break;
      case 'candidato':
        data = await this.candidatoRepository.find({
          where: {
            createdAt: Between(
              new Date(inicio),
              new Date(fin)
            ),
          }
        })
        break;
      default:
        return { ok: false, msg: 'Collecion no encontrada' };

    }

    return { resultado: data };

  }

  async findAllModelsTermimo(searchTerminoDto: SearchTerminoDto) {

    const { modelo, termino, inicio, fin } = searchTerminoDto;

    const modelos = ['usuario', 'producto', 'novedad', 'agente', 'visita', 'archivo','vacante','candidato'];

    if (!modelos.includes(modelo)) throw new BadRequestException('Models NotFound...');

    let data: any[] = [];

    switch (modelo) {
      case 'producto':

        const products = await this.productRepository.find({
          where: [
            {
              title: Like(`%${termino}%`)
            },
            {
              gender: Like(`%${termino}%`)
            },
          ],
          relations: {
            images: true
          }
        })

        data = products.map(product => ({
          ...product,
          images: product.images.map(img => img.url)
        }))

        break;
      case 'usuario':
        data = await this.userRepository.find({
          where: [
            {
              email: Like(`%${termino}%`)
            },
            {
              fullName: Like(`%${termino}%`)
            },
          ],
          relations: {
            images: true
          }
        })
        break;
      case 'novedad':

        const novedad = await this.novedadRepository.find({
          where: [
            {
              tipo: Like(`%${termino}%`)
            },
            {
              puesto: Like(`%${termino}%`)
            },
            {
              preliminar: Like(`%${termino}%`)
            },
            {
              descripcion: Like(`%${termino}%`)
            },
            {
              fecha: Between(
                new Date(inicio),
                new Date(fin)
              ),
            }
          ],
          relations: {
            images: true
          }
        })

        data = novedad.map(novedad => ({
          ...novedad,
          images: novedad.images.map(img => img.url)
        }))

        break;
      case 'visita':

        const visitas = await this.visitaRepository.find({
          where: [
            {
              tipo: Like(`%${termino}%`)
            },
            {
              puesto: Like(`%${termino}%`)
            },
            {
              empresa: Like(`%${termino}%`)
            },
            {
              empleado: Like(`%${termino}%`)
            },
          ],
          relations: {
            images: true
          }
        })

        data = visitas.map(visita => ({
          ...visita,
          images: visita.images.map(img => img.url)
        }))

        break;
      case 'agente':

        const agentes = await this.agenteRepository.find({
          where: [
            {
              nombre: Like(`%${termino}%`)
            },
            {
              dpi: Like(`%${termino}%`)
            },
            {
              telefono: Like(`%${termino}%`)
            },
            {
              correo: Like(`%${termino}%`)
            },
            {
              direccion: Like(`%${termino}%`)
            },
            {
              igss: Like(`%${termino}%`)
            },
            {
              nit: Like(`%${termino}%`)
            },
            {
              sangre: Like(`%${termino}%`)
            },
            {
              puesto: Like(`%${termino}%`)
            },
            {
              grupo: Like(`%${termino}%`)
            },
            {
              estado: Like(`%${termino}%`)
            },
          ],
          relations: {
            images: true
          }
        })

        data = agentes.map(agente => ({
          ...agente,
          images: agente.images.map(img => img.url)
        }))

        break;
      case 'archivo':

        const archivos = await this.archivoRepository.find({
          where: [
            {
              tipo: Like(`%${termino}%`)
            },
            {
              correlativo: Like(`%${termino}%`)
            },
            {
              clasificacion: Like(`%${termino}%`)
            },
            {
              unidad: Like(`%${termino}%`)
            },
            {
              descripcion: Like(`%${termino}%`)
            },
          ],
          relations: {
            images: true
          }
        })

        data = archivos.map(archivo => ({
          ...archivo,
          images: archivo.images.map(img => img.url)
        }))

        break;
      case 'vacante':

        const vacante = await this.vacanteRepository.find({
          where: [
            {
              titulo: Like(`%${termino}%`)
            },
            {
              empresa: Like(`%${termino}%`)
            },
            {
              salario: Like(`%${termino}%`)
            },
            {
              contrato: Like(`%${termino}%`)
            },
            {
              ubicacion: Like(`%${termino}%`)
            },
            {
              descripcion: Like(`%${termino}%`)
            },
          ],
          relations: {
            candidatos: true
          }
        })

        data = vacante

        break;
      case 'candidato':

        const candidato = await this.candidatoRepository.find({
          where: [
            {
              nombre: Like(`%${termino}%`)
            },
            {
              email: Like(`%${termino}%`)
            },
            {
              telefono: Like(`%${termino}%`)
            }
          ]
        })

        data = candidato

        break;
      default:
        return { ok: false, msg: 'Collecion no encontrada' };

    }

    return { resultado: data };

  }


  /**
   * Buscar por Tipo de modelo y termino 
   */

  async findAllModelosTerminos(searchFindAllDto: SearchFindAllDto) {

    const { modelo, termino } = searchFindAllDto;

    const modelos = ['usuario', 'producto', 'novedad', 'agente', 'visita', 'archivo','vacante','candidato'];

    if (!modelos.includes(modelo)) throw new BadRequestException('Models NotFound...');

    let data: any[] = [];

    switch (modelo) {
      case 'producto':

        const products = await this.productRepository.find({
          where: [
            {
              title: Like(`%${termino}%`)
            },
            {
              gender: Like(`%${termino}%`)
            },
          ],
          relations: {
            images: true
          }
        })

        data = products.map(product => ({
          ...product,
          images: product.images.map(img => img.url)
        }))

        break;
      case 'usuario':
        data = await this.userRepository.find({
          where: [
            {
              email: Like(`%${termino}%`)
            },
            {
              fullName: Like(`%${termino}%`)
            },
          ],
          relations: {
            images: true
          }
        })
        break;
      case 'novedad':

        const novedad = await this.novedadRepository.find({
          where: [
            {
              tipo: Like(`%${termino}%`)
            },
            {
              puesto: Like(`%${termino}%`)
            },
            {
              preliminar: Like(`%${termino}%`)
            },
            {
              descripcion: Like(`%${termino}%`)
            },

          ],
          relations: {
            images: true
          }
        })

        data = novedad.map(novedad => ({
          ...novedad,
          images: novedad.images.map(img => img.url)
        }))

        break;
      case 'visita':

        const visitas = await this.visitaRepository.find({
          where: [
            {
              tipo: Like(`%${termino}%`)
            },
            {
              puesto: Like(`%${termino}%`)
            },
            {
              empresa: Like(`%${termino}%`)
            },
            {
              empleado: Like(`%${termino}%`)
            },
            {
              descripcion: Like(`%${termino}%`)
            },
          ],
          relations: {
            images: true
          }
        })

        data = visitas.map(visita => ({
          ...visita,
          images: visita.images.map(img => img.url)
        }))

        break;
      case 'agente':

        const agentes = await this.agenteRepository.find({
          where: [
            {
              nombre: Like(`%${termino}%`)
            },
            {
              dpi: Like(`%${termino}%`)
            },
            {
              telefono: Like(`%${termino}%`)
            },
            {
              correo: Like(`%${termino}%`)
            },
            {
              direccion: Like(`%${termino}%`)
            },
            {
              igss: Like(`%${termino}%`)
            },
            {
              nit: Like(`%${termino}%`)
            },
            {
              sangre: Like(`%${termino}%`)
            },
            {
              puesto: Like(`%${termino}%`)
            },
            {
              grupo: Like(`%${termino}%`)
            },
            {
              estado: Like(`%${termino}%`)
            },
          ],
          relations: {
            images: true
          }
        })

        data = agentes.map(agente => ({
          ...agente,
          images: agente.images.map(img => img.url)
        }))

        break;
      case 'archivo':

        const archivos = await this.archivoRepository.find({
          where: [
            {
              tipo: Like(`%${termino}%`)
            },
            {
              correlativo: Like(`%${termino}%`)
            },
            {
              clasificacion: Like(`%${termino}%`)
            },
            {
              unidad: Like(`%${termino}%`)
            },
            {
              descripcion: Like(`%${termino}%`)
            },
          ],
          relations: {
            images: true
          }
        })

        data = archivos.map(archivo => ({
          ...archivo,
          images: archivo.images.map(img => img.url)
        }))

        break;
      default:
        return { ok: false, msg: 'Collecion no encontrada' };

    }

    return { resultado: data };

  }


  /**
   * Reporteria
   */

  async countModels() {
    let data: any[] = [];

    const usuario = await this.userRepository.count();
    const agente = await this.agenteRepository.count();
    const novedad = await this.novedadRepository.count();
    const visita = await this.visitaRepository.count();
    const archivo = await this.archivoRepository.count();

    data.push(usuario, agente, novedad, visita, archivo);
    return data;

  }



  async graficas(graficaModeloDto: GraficaModeloDto) {
    const { modelo } = graficaModeloDto;
    const modelos = ['usuario', 'producto', 'novedad', 'agente', 'visita', 'archivo'];

    if (!modelos.includes(modelo)) throw new BadRequestException('Models NotFound...');

    let data: any[] = [];

    switch (modelo) {
      case 'producto':
        data = await this.productRepository
          .createQueryBuilder('producto')
          .select("producto.title")
          .addSelect("COUNT(*)")
          .groupBy("producto.title")
          .execute();
        break;
      case 'usuario':
        data = await this.userRepository
          .createQueryBuilder('user')
          .select("user.isActive")
          .addSelect("COUNT(*)")
          .groupBy("user.isActive")
          .execute();
        break;
      case 'novedad':
        data = await this.novedadRepository
          .createQueryBuilder('novedad')
          .select("novedad.tipo")
          .addSelect("COUNT(*)")
          .groupBy("novedad.tipo")
          .execute();
        break;
      case 'visita':
        data = await this.visitaRepository
          .createQueryBuilder('visita')
          .select("visita.tipo")
          .addSelect("COUNT(*)")
          .groupBy("visita.tipo")
          .execute();
        break;
      case 'agente':
        data = await this.agenteRepository
          .createQueryBuilder('agente')
          .select("agente.puesto")
          .addSelect("COUNT(*)")
          .groupBy("agente.puesto")
          .execute();
        break;
      case 'archivo':
        data = await this.archivoRepository
          .createQueryBuilder('archivo')
          .select("archivo.tipo")
          .addSelect("COUNT(*)")
          .groupBy("archivo.tipo")
          .execute();
        break;
      default:
        return { ok: false, msg: 'Collecion no encontrada' };

    }

    return { resultado: data };

  }

  ///para visitas de hoy actual

  async SearchVisitaByDate() {


    let date = new Date()
    let day = `${(date.getDate())}`.padStart(2, '0');
    let month = `${(date.getMonth() + 1)}`.padStart(2, '0');
    let year = date.getFullYear();

    const hoy = `${year}-${month}-${day}`;

    const data = await this.visitaRepository.find({
      where: {
        autorizacion_admin: true,
        autorizacion_seguridad: true,
        fechas: ArrayContains([hoy])
      },
      relations: {
        images: true
      }
    })



    const visitas = data.map(item => ({
      ...item,
      images: item.images.map(img => img.url)
    }))

    return { ok: true, visitas };
  }


}
