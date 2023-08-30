import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { VisitaImage } from "./visita-image.entity";


@Entity()
export class Visita {
    @ApiProperty({
        example:'608af6bc-6753-49b4-84f2-70c0a9118a3a',
        description:'Identificador unico generado por uuid.',
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example:'Suceso',
        description:'tipo de novedad',
    })
    @Column('text')
    tipo:string;

    @ApiProperty({
        example:'Entrada o ingreso',
        description:'Entrada o ingresos'
    })
    @Column('text')
    puesto:string;

    @ApiProperty({
        example:'name one, name two....',
        description:'Arreglo de nombres'
    })
    @Column('text',{
        array:true,
        default:[]
    })
    nombre?:string[];

    @ApiProperty({
        example:'dpi one, dpi two....',
        description:'Arreglo de dpi'
    })
    @Column('text',{
        array:true,
        default:[]
    })
    dpi?:string[];

    @ApiProperty({
        example:'placa one, placa two....',
        description:'Arreglo de placa',
        default:[]
    })
    @Column('text',{
        array:true,
        default:[]
    })
    placa?:string[];

    @ApiProperty({
        example:'Name empresa',
        description:'Nombre de la empresa o proveedor'
    })
    @Column('text')
    empresa:string;

    @ApiProperty({
        example:'Name employe',
        description:'Persona a quien visita'
    })
    @Column('text')
    empleado:string;

    @ApiProperty({
        example:'["2023-01-01","2024-01-01"]',
        description:'rango de fechas de ingreso',
        default:[]
    })
    @Column('text',{
        array:true,
        default:[]
    })
    fechas:string[];


    @ApiProperty({
        example:'2023-10-10',
        description:'Fecha de ingreso'
    })
    @Column({ type: 'timestamp' })
    ingreso:Date;


    @ApiProperty({
        example:'2023-10-10',
        description:'Fecha del suceso'
    })
    @Column({ type: 'timestamp', nullable:true, })
    salida?:Date;

    @Column('bool',{
        default:true
    })
    estado:boolean;

    @ApiProperty({
        example:'El evento ocurrio en xxx lugar.',
        description:'Descripción de la visita',
        nullable:true
    })
    @Column({
        type:'text',
        nullable:true,
        
    })
    descripcion?:string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;


    @ApiProperty({
        example:"http://localhost:3000/api/v1/files/product/6f77b86c-cc9a-4848-b982-e2f382a69ec3.png",
        description:'Retornara una o un arreglo de images'
    })
    @OneToMany(
        ()=>VisitaImage,
        (visitaImage)=>visitaImage.visita,
        {cascade:true,eager:true}
    )
    images?:VisitaImage[];


    @ApiProperty({
        type: () => User,
        description:'Retornara un usuario relacionado'
    })
    @ManyToOne(
        ()=>User,
        (user)=>user.visita,
        {eager:true}
    )
    user:User;
    


}
