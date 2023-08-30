import { Entity, PrimaryGeneratedColumn,Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { User } from 'src/auth/entities/user.entity';


@Entity()
export class ProductImage{

    @PrimaryGeneratedColumn()
    id:number;

    @Column('text')
    url:string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ManyToOne(
        ()=>Product,
        (product)=>product.images,
        {onDelete:'CASCADE'}
    )
    product:Product

    @ManyToOne(
        ()=>User,
        (user)=>user.productImage,
        {eager:true}
    )
    user:User;
}