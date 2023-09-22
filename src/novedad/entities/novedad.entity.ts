import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { NovedadImage } from "./novedad-image.entity";
import { User } from "src/auth/entities/user.entity";



@Entity()
export class Novedad {

    @ApiProperty({
        example: '608af6bc-6753-49b4-84f2-70c0a9118a3a',
        description: 'Identificador unico generado por uuid.',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Suceso',
        description: 'tipo de novedad',
    })
    @Column('text')
    tipo: string;

    @ApiProperty({
        example: 'name one, name two....',
        description: 'Arreglo de nombres',
        default: []
    })
    @Column('text', {
        array: true,
        default: []
    })
    nombre?: string[];

    @ApiProperty({
        example: 'dpi one, dpi two....',
        description: 'Arreglo de dpi',
        default: []
    })
    @Column('text', {
        array: true,
        default: []
    })
    dpi?: string[];

    @ApiProperty({
        example: 'placa one, placa two....',
        description: 'Arreglo de placa',
        default: []
    })
    @Column('text', {
        array: true,
        default: []
    })
    placa?: string[];

    @ApiProperty({
        example: '2023-10-10',
        description: 'Fecha del suceso'
    })
    @Column({ type: 'timestamptz',default: () => "CURRENT_TIMESTAMP(6)"  })
    fecha: Date;

    @ApiProperty({
        example: '08:20',
        description: 'Hora del suceso'
    })
    @Column('text')
    hora: string;

    @ApiProperty({
        example: 'Entrada o ingreso',
        description: 'Entrada o ingresos'
    })
    @Column('text')
    puesto: string;

    @ApiProperty({
        example: 'El succeso ocurrio...',
        description: 'Datos del succeso preliminar',
        nullable: true
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    preliminar?: string;


    @ApiProperty({
        example: 'El evento ocurrio en xxx lugar.',
        description: 'Descripción de la novedad',
        nullable: true
    })
    @Column({
        type: 'text',
        nullable: true,

    })
    descripcion?: string;

    @ApiProperty({
        example: "http://localhost:3000/api/v1/files/product/6f77b86c-cc9a-4848-b982-e2f382a69ec3.png",
        description: 'Retornara una o un arreglo de images'
    })
    @OneToMany(
        () => NovedadImage,
        (novedadImage) => novedadImage.novedad,
        { cascade: true, eager: true }
    )
    images?: NovedadImage[];

    @CreateDateColumn({ type: 'timestamptz',default: () => "CURRENT_TIMESTAMP(6)"  })
    createdAt: Date;


    @ApiProperty({
        type: () => User,
        description: 'Retornara un usuario relacionado'
    })
    @ManyToOne(
        () => User,
        (user) => user.novedad,
        { eager: true }
    )
    user: User;
}


