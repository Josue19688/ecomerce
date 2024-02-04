
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/entities/user.entity";
import { Inventario } from "src/inventario/entities/inventario.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Mantenimiento {
    @ApiProperty({
        example:'608af6bc-6753-49b4-84f2-70c0a9118a3a',
        description:'Identificador unico generado por uuid.',
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ApiProperty({
        example:'Informatica',
        description:'Nombre de la division donde esta asignado'
    })
    @Column('text')
    division:string;

    @ApiProperty({
        example:'192.168.0.25',
        description:'IP asignada a la maquina'
    })
    @Column('text')
    ip:string;

    @ApiProperty({
        example:'zona 4',
        description:'sede donde esta ubicada'
    })
    @Column('text')
    sede:string;

    @ApiProperty({
        example:'si-no -bodega',
        description:'estado actual del equipo'
    })
    @Column('text')
    estado:string;

    @ApiProperty({
        example:'mantenimiento preventivo',
        description:'tipo de servicio prestado'
    })
    @Column('text')
    tipoServicio:string;

    @ApiProperty({
        example: '2023-10-10',
        description: 'Fecha del suceso'
    })
    @Column({ type: 'timestamptz',default: () => "CURRENT_TIMESTAMP(6)"  })
    fecha: Date;

    @ApiProperty({
        example:'josoy ',
        description:'nombre del tecnico que realizo el mantenimiento'
    })
    @Column('text')
    tecnico:string;

    @ApiProperty({
        example:'Descripcion del equipo',
        description:'Descripcion del equipo'
    })
    @Column({
        type:'text',
        nullable:true,
        
    })
    descripcion?:string;

    @CreateDateColumn({ type: 'timestamptz',default: () => "CURRENT_TIMESTAMP(6)"  })
    createdAt: Date;

    @ApiProperty({
        type: () => User,
        description:'Retornara un usuario relacionado'
    })
    @ManyToOne(
        ()=>User,
        (user)=>user.mantenimiento,
        {eager:true}
    )
    user:User;

    @ApiProperty({
        type: () => Inventario,
        description:'Retornara un equipo relacionado'
    })
    @ManyToOne(
        ()=>Inventario,
        (inventario)=>inventario.mantenimiento,
        {eager:true}
    )
    inventario:Inventario;
}
