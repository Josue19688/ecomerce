import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PostImage } from "./post-image.entity";
import { User } from "src/auth/entities/user.entity";

@Entity()
export class Post {
    @ApiProperty({
        example:'608af6bc-6753-49b4-84f2-70c0a9118a3a',
        description:'Identificador unico generado por uuid.',
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example:'T-shirt',
        description:'Nombre del producto',
    })
    @Column('text')
    title:string;

  

    @ApiProperty({
        example:'T-shirt color blanco, logo vengadores.',
        description:'Descripción del producto',
        nullable:true
    })
    @Column({
        type:'text',
        nullable:true,
        
    })
    descripcion:string;


    @ApiProperty({
        example:"http://localhost:3000/api/v1/files/product/6f77b86c-cc9a-4848-b982-e2f382a69ec3.png",
        description:'Retornara una o un arreglo de images'
    })
    @OneToMany(
        ()=>PostImage,
        (postImage)=>postImage.post,
        {cascade:true,eager:true}
    )
    images?:PostImage[];


    @ApiProperty({
        example:'ajvasquez',
        description:'usuario que realizo el comentario'
    })
    @Column('text',{
        array:true,
        default:[]
    })
    userComentario:string[];


    @ApiProperty({
        example:'descripcion del comentario',
        description:'descripcion del comentario'
    })
    @Column('text',{
        array:true,
        default:[]
    })
    comentarios:string[];

    @ApiProperty({
        example:'T-shirt',
        description:'Nombre del producto',
    })
    @Column({
        type:'text',
        nullable:true,
        
    })
    fechas:string;

    @CreateDateColumn({ type: 'timestamptz',default: () => "CURRENT_TIMESTAMP(6)"  })
    createdAt: Date;

    @ApiProperty({
        example:User,
        description:'Retornara un usuario relacionado'
    })
    @ManyToOne(
        ()=>User,
        (user)=>user.product,
        {eager:true}
    )
    user:User;


}
