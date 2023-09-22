



import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "src/auth/entities/user.entity";
import { Archivo } from './archivo.entity';




@Entity()
export class ArchivoImage{

    @PrimaryGeneratedColumn()
    id:number;

    @Column('text')
    url:string;

    @CreateDateColumn({ type: 'timestamptz',default: () => "CURRENT_TIMESTAMP(6)"  })
    createdAt: Date;


   
    @ManyToOne(
        ()=>Archivo,
        (archivo)=>archivo.images,
        {onDelete:'CASCADE'}
    )
    archivo:Archivo

    
 
    @ManyToOne(
        ()=>User,
        (user)=>user.visitaImage,
        {eager:true}
    )
    user:User;
}