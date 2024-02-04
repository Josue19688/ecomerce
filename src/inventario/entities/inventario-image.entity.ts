



import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "src/auth/entities/user.entity";
import { Inventario } from "./inventario.entity";





@Entity()
export class InventarioImage{

    @PrimaryGeneratedColumn()
    id:number;

    @Column('text')
    url:string;

    @CreateDateColumn({ type: 'timestamptz',default: () => "CURRENT_TIMESTAMP(6)"  })
    createdAt: Date;


   
    @ManyToOne(
        ()=>Inventario,
        (inventario)=>inventario.images,
        {onDelete:'CASCADE'}
    )
    inventario:Inventario

    
 
    @ManyToOne(
        ()=>User,
        (user)=>user.inventarioImage,
        {eager:true}
    )
    user:User;
}