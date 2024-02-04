import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { InventarioImage } from "./inventario-image.entity";
import { Mantenimiento } from "src/mantenimiento/entities/mantenimiento.entity";



@Entity()
export class Inventario {
    @ApiProperty({
        example:'608af6bc-6753-49b4-84f2-70c0a9118a3a',
        description:'Identificador unico generado por uuid.',
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ApiProperty({
        example:'MJ06AA2P',
        description:'Service tag del equipo',
        uniqueItems:true
    })
    @Column('text',{
        unique:true
    })
    serviceTag:string;

    @ApiProperty({
        example:'00055SDF',
        description:'Numero de inventario del equipo',
        uniqueItems:true
    })
    @Column('text',{
        unique:true
    })
    numeroInventario:string;

    @ApiProperty({
        example:'jose osoy',
        description:'Nombre de la persona a quien esta signado'
    })
    @Column({
        type:'text',
        nullable:true,
        
    })
    asignado?:string;

    @ApiProperty({
        example:'Laptop',
        description:'tipo de equipo de computo'
    })
    @Column('text')
    tipo:string;

    @ApiProperty({
        example:'HP',
        description:'Marca del equipo'
    })
    @Column('text')
    marca:string;

    @ApiProperty({
        example:'Informatica',
        description:'Nombre de la division donde esta asignado'
    })
    @Column('text')
    division:string;

    @ApiProperty({
        example:'zona 4',
        description:'sede donde esta ubicada'
    })
    @Column({
        type:'text',
        nullable:true,
        
    })
    sede:string;

    @ApiProperty({
        example:'desarrollo',
        description:'Nombre del departamento donde esta asignado'
    })
    @Column({
        type:'text',
        nullable:true,
        
    })
    departamento?:string;

    @ApiProperty({
        example:'Oficina Soporte',
        description:'Ubicacion actual del equipo'
    })
    @Column({
        type:'text',
        nullable:true,
        
    })
    ubicacion?:string;

    @ApiProperty({
        example:'Descripcion del equipo',
        description:'Descripcion del equipo'
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
        ()=>InventarioImage,
        (inventarioImage)=>inventarioImage.inventario,
        {cascade:true,eager:true}
    )
    images?:InventarioImage[];

    @CreateDateColumn({ type: 'timestamptz',default: () => "CURRENT_TIMESTAMP(6)"  })
    createdAt: Date;

    @ApiProperty({
        type: () => User,
        description:'Retornara un usuario relacionado'
    })
    @ManyToOne(
        ()=>User,
        (user)=>user.inventario,
        {eager:true}
    )
    user:User;


    //TODO:Relaciones para el mantenimiento
   
    @OneToMany(
        ()=>Mantenimiento,
        (mantenimiento)=>mantenimiento.user
    )
    mantenimiento:Mantenimiento;
}
