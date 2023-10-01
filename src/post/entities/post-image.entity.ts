



import { Entity, PrimaryGeneratedColumn,Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Post } from './post.entity';


@Entity()
export class PostImage{

    @PrimaryGeneratedColumn()
    id:number;

    @Column('text')
    url:string;

    @CreateDateColumn({ type: 'timestamptz',default: () => "CURRENT_TIMESTAMP(6)"  })
    createdAt: Date;

    @ManyToOne(
        ()=>Post,
        (post)=>post.images,
        {onDelete:'CASCADE'}
    )
    post:Post

}