import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Product {

    @ApiProperty({
        example:'608af6bc-6753-49b4-84f2-70c0a9118a3a',
        description:'Identificador unico generado por uuid.',
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example:'T-shirt',
        description:'Nombre del producto',
        uniqueItems:true
    })
    @Column('text',{
        unique:true
    })
    title:string;

    @ApiProperty({
        example:0,
        description:'Precio del producto'
    })
    @Column('float',{
        default:0
    })
    price:number;

    @ApiProperty({
        example:'T-shirt color blanco, logo vengadores.',
        description:'Descripción del producto',
        nullable:true
    })
    @Column({
        type:'text',
        nullable:true,
        
    })
    description:string;

    @ApiProperty({
        example:'T-shirt-color-blanco',
        description:'Referencia para ceo',
        uniqueItems:true
    })
    @Column('text',{
        unique:true
    })
    slug:string;

    @ApiProperty({
        example:0,
        description:'Cantidad de productos en existencia.'
    })
    @Column('int',{
        default:0
    })
    stock:number;

    @ApiProperty({
        example:'["M","S","XL"]',
        description:'Array de tallas del producto'
    })
    @Column('text',{
        array:true
    })
    sizes:string[];

    @ApiProperty({
        example:'men',
        description:'Genero del producto'
    })
    @Column('text')
    gender:string

    @ApiProperty({
        example:'["T-shirt","Ropa"]',
        description:'Tags para busqueda de productos array',
        default:[]
    })
    @Column('text',{
        array:true,
        default:[]
    })
    tags:string[];

    @ApiProperty({
        example:"http://localhost:3000/api/v1/files/product/6f77b86c-cc9a-4848-b982-e2f382a69ec3.png",
        description:'Retornara una o un arreglo de images'
    })
    @OneToMany(
        ()=>ProductImage,
        (productImage)=>productImage.product,
        {cascade:true,eager:true}
    )
    images?:ProductImage[];

    @CreateDateColumn({ type: 'timestamptz',default: () => "CURRENT_TIMESTAMP(6)"  })
    createdAt: Date;

    @ApiProperty({
        example:User,
        description:'Retornara un usuario relacionado'
    })
    @ManyToOne(
        ()=>User,
        (user)=>user.product,
        {eager:true}
    )
    user:User;


    @BeforeInsert()
    checkSlugInsert(){
        if(!this.slug){
          this.slug=this.title
        }

        this.slug=this.slug
          .toLocaleLowerCase()
          .replaceAll(' ','_')
          .replaceAll("'",'')
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        // if(!this.slug){
        //   this.slug=this.title
        // }

        this.slug=this.slug
          .toLocaleLowerCase()
          .replaceAll(' ','_')
          .replaceAll("'",'')
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
    }
}
