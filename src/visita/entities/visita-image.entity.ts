import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "src/auth/entities/user.entity";
import { Visita } from "./visita.entity";



@Entity()
export class VisitaImage{

    @PrimaryGeneratedColumn()
    id:number;

    @Column('text')
    url:string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;


   
    @ManyToOne(
        ()=>Visita,
        (visita)=>visita.images,
        {onDelete:'CASCADE'}
    )
    visita:Visita

    
 
    @ManyToOne(
        ()=>User,
        (user)=>user.visitaImage,
        {eager:true}
    )
    user:User;
}