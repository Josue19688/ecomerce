



import { Entity, PrimaryGeneratedColumn,Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Post } from './post.entity';
import { User } from 'src/auth/entities/user.entity';


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

    @ManyToOne(
        ()=>User,
        (user)=>user.postImage,
        {eager:true}
    )
    user:User;
}