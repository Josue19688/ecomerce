






import { Entity, PrimaryGeneratedColumn,Column, ManyToOne, CreateDateColumn } from 'typeorm';

import { User } from 'src/auth/entities/user.entity';
import { Agente } from './agente.entity';


@Entity()
export class AgenteImage{

    @PrimaryGeneratedColumn()
    id:number;

    @Column('text')
    url:string;

    @CreateDateColumn({ type: 'timestamptz',default: () => "CURRENT_TIMESTAMP(6)"  })
    createdAt: Date;

    @ManyToOne(
        ()=>Agente,
        (agente)=>agente.images,
        {onDelete:'CASCADE'}
    )
    agente:Agente

    @ManyToOne(
        ()=>User,
        (user)=>user.agenteImage,
        {eager:true}
    )
    user:User;
}