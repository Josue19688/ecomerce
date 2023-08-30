import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ArchivoImage } from "./archivo-image.entity";
import { User } from "src/auth/entities/user.entity";


@Entity()
export class Archivo {

    @ApiProperty({
        example:'608af6bc-6753-49b4-84f2-70c0a9118a3a',
        description:'Identificador unico generado por uuid.',
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ApiProperty({
        example:'Tipo Documento',
        description:'Tipo de documento'
    })
    @Column('text')
    tipo:string;

    @ApiProperty({
        example:'Correlativo',
        description:'Correlativo del documento '
    })
    @Column('text')
    correlativo:string;

    @ApiProperty({
        example:'Ingreso/Salida',
        description:'Clasificacion del documento si es salida o ingreso'
    })
    @Column('text')
    clasificacion:string;

    @ApiProperty({
        example:'Unidad',
        description:'Unidad o departamento'
    })
    @Column('text')
    unidad:string;

    @ApiProperty({
        example:'2023-10-10',
        description:'Fecha del documento'
    })
    @Column({ type: 'timestamp', nullable:true, })
    fecha:Date;

    @ApiProperty({
        example:'Descripcion del documento.',
        description:'Descripción',
        nullable:true
    })
    @Column({
        type:'text',
        nullable:true,
        
    })
    descripcion?:string;

    @ApiProperty({
        example:"http://localhost:3000/api/v1/files/product/6f77b86c-cc9a-4848-b982-e2f382a69ec3.png",
        description:'Retornara una o un arreglo de images'
    })
    @OneToMany(
        ()=>ArchivoImage,
        (archivoImage)=>archivoImage.archivo,
        {cascade:true,eager:true}
    )
    images?:ArchivoImage[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ApiProperty({
        type: () => User,
        description:'Retornara un usuario relacionado'
    })
    @ManyToOne(
        ()=>User,
        (user)=>user.archivo,
        {eager:true}
    )
    user:User;

}
