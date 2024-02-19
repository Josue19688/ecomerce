import { ApiProperty } from "@nestjs/swagger";
import { Product, ProductImage } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserImage } from "./user-image.entity";
import { NovedadImage } from "src/novedad/entities/novedad-image.entity";
import { Novedad } from "src/novedad/entities/novedad.entity";
import { Visita } from "src/visita/entities/visita.entity";
import { VisitaImage } from "src/visita/entities/visita-image.entity";
import { Archivo } from "src/archivo/entities/archivo.entity";
import { ArchivoImage } from "src/archivo/entities/archivo-image.entity";
import { AgenteImage } from "src/agente/entities/agente-image.entity";
import { Agente } from "src/agente/entities/agente.entity";
import { Post } from "src/post/entities/post.entity";
import { PostImage } from "src/post/entities/post-image.entity";
import { Vacante } from "src/vacante/entities/vacante.entity";
import { Candidato } from "src/vacante/entities/candidato.entity";



@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        unique:true
    })
    email?:string;

    @Column('text',{
        select:false
    })
    password?:string;

    @Column('text')
    fullName?:string;

    @Column('text',{
        nullable: true 
    })
    ocupacion?:string;

    @Column('bool',{
        default:false
    })
    isActive?:boolean;

    @Column('text',{
        array:true,
        default:['user']
    })
    roles?:string[];

    @Column('uuid',{ unique: true})
    activationToken: string;


    @Column('uuid',{ 
        unique: true,  
        nullable: true 
    })
    resetPasswordToken: string;

    @CreateDateColumn({ type: 'timestamptz',default: () => "CURRENT_TIMESTAMP(6)"  })
    createdAt: Date;

    //TODO:RELACIONES CON IMAGES DE USUARIOS

    @ApiProperty({
        example:"http://localhost:3000/api/v1/files/product/6f77b86c-cc9a-4848-b982-e2f382a69ec3.png",
        description:'Retornara una o un arreglo de images'
    })
    @OneToMany(
        ()=>UserImage,
        (userImage)=>userImage.user,
        {cascade:true,eager:true}
    )
    images?:UserImage[];

     //TODO:RELACIONES CON POST

     @OneToMany(
        ()=>Post,
        (post)=>post.user
    )
    post:Post;

    @OneToMany(
        ()=>PostImage,
        (postImage)=>postImage.user
    )
    postImage:PostImage;

    //TODO:RELACIONES CON PRODUCTOS

    @OneToMany(
        ()=>Product,
        (product)=>product.user
    )
    product:Product;

    @OneToMany(
        ()=>ProductImage,
        (productImage)=>productImage.user
    )
    productImage:ProductImage;

    //TODO:RELACIONES CON NOVEDADES

    @OneToMany(
        ()=>Novedad,
        (novedad)=>novedad.user
    )
    novedad:Novedad;

    @OneToMany(
        ()=>NovedadImage,
        (novedadImage)=>novedadImage.user
    )
    novedadImage:NovedadImage;


    //TODO:RELACIONES CON VISITAS

    @OneToMany(
        ()=>Visita,
        (visita)=>visita.user
    )
    visita:Visita;

    @OneToMany(
        ()=>VisitaImage,
        (visitaImage)=>visitaImage.user
    )
    visitaImage:VisitaImage;

    //TODO:RELACIONES CON ARCHIVOS

    @OneToMany(
        ()=>Archivo,
        (archivo)=>archivo.user
    )
    archivo:Archivo;

    @OneToMany(
        ()=>ArchivoImage,
        (archivoImage)=>archivoImage.user
    )
    archivoImage:ArchivoImage;

    //TODO:RELACIONES CON AGENTES

    @OneToMany(
        ()=>Agente,
        (agente)=>agente.user
    )
    agente:Agente;

    @OneToMany(
        ()=>AgenteImage,
        (agenteImage)=>agenteImage.user
    )
    agenteImage:AgenteImage;


     //TODO:RELACIONES CON VACANTES

     @OneToMany(
        ()=>Vacante,
        (v)=>v.user
    )
    vacante:Vacante;

    @OneToMany(
        ()=>Candidato,
        (c)=>c.user
    )
    candidato:Candidato;

   

    @BeforeInsert()
    checkFieldBeforeInsert(){
        this.email=this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldBeforeUpdate(){
        this.email=this.email.toLowerCase().trim();
    }

}
