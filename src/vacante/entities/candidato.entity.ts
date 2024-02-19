

import { Entity, PrimaryGeneratedColumn,Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Vacante } from './vacante.entity';
import { ApiProperty } from '@nestjs/swagger';


@Entity()
export class Candidato{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    nombre:string;

    @Column('text')
    email:string;

    @Column('text')
    telefono:string;

    @Column('text',{
        array:true,
        default:[]
    })
    documentos:string[];

    @CreateDateColumn({ type: 'timestamptz',default: () => "CURRENT_TIMESTAMP(6)"  })
    createdAt: Date;

    @ManyToOne(
        ()=>Vacante,
        (vacante)=>vacante.candidatos,
        {onDelete:'CASCADE'}
    )
    vacante:Vacante

    @ManyToOne(
        ()=>User,
        (user)=>user.candidato,
        {eager:true}
    )
    user:User;
}