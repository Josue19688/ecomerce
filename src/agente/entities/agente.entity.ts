import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AgenteImage } from "./agente-image.entity";
import { User } from "src/auth/entities/user.entity";



@Entity()
export class Agente {

    @ApiProperty({
        example:'608af6bc-6753-49b4-84f2-70c0a9118a3a',
        description:'Identificador unico generado por uuid.',
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example:'Josue',
        description:'Nombre de la persona',
    })
    @Column('text')
    nombre:string;

    @ApiProperty({
        example:'2078956885545',
        description:'DPI de la persona',
    })
    @Column('text')
    dpi:string;

    @ApiProperty({
        example:'14/02/1995',
        description:'Fecha de nacimiento',
    })
    @Column('text')
    nacimiento:string;


    @ApiProperty({
        example:'33528265',
        description:'No. de telefono',
    })
    @Column('text')
    telefono:string;

    @ApiProperty({
        example:'test@google.com',
        description:'Correo de la persona',
    })
    @Column('text')
    correo:string;

    @ApiProperty({
        example:'14 av 14-87 zona 0 guatemala',
        description:'Direccion ',
    })
    @Column('text')
    direccion:string;

    @ApiProperty({
        example:'20587541552256',
        description:'No. igss ',
    })
    @Column('text')
    igss:string;

    @ApiProperty({
        example:'20587541552256',
        description:'No. Identificacion tributaria ',
    })
    @Column('text')
    nit:string;

    @ApiProperty({
        example:'o+',
        description:'Tipo de sanfre ',
    })
    @Column('text')
    sangre:string;

    @ApiProperty({
        example:'Seguridad Ejecutiva',
        description:'Puesto de servicio actual.',
    })
    @Column('text')
    puesto:string;

    @ApiProperty({
        example:'A',
        description:'Grupo actual.',
    })
    @Column('text')
    grupo:string;

    @ApiProperty({
        example:'Activo/Vacaciones/Baja/Suspendido',
        description:'Estado actual de la persona',
    })
    @Column('text')
    estado:string;

    @ApiProperty({
        example:"http://localhost:3000/api/v1/files/product/6f77b86c-cc9a-4848-b982-e2f382a69ec3.png",
        description:'Retornara una o un arreglo de images'
    })
    @OneToMany(
        ()=>AgenteImage,
        (agenteImage)=>agenteImage.agente,
        {cascade:true,eager:true}
    )
    images?:AgenteImage[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ApiProperty({
        type: () => User,
        description:'Retornara un usuario relacionado'
    })
    @ManyToOne(
        ()=>User,
        (user)=>user.agente,
        {eager:true}
    )
    user:User;



}
