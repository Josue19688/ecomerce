



import { Entity, PrimaryGeneratedColumn,Column, ManyToOne, CreateDateColumn } from 'typeorm';

import { User } from 'src/auth/entities/user.entity';
import { Novedad } from './novedad.entity';


@Entity()
export class NovedadImage{

    @PrimaryGeneratedColumn()
    id:number;

    @Column('text')
    url:string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ManyToOne(
        ()=>Novedad,
        (novedad)=>novedad.images,
        {onDelete:'CASCADE'}
    )
    novedad:Novedad

    @ManyToOne(
        ()=>User,
        (user)=>user.novedadImage,
        {eager:true}
    )
    user:User;
}