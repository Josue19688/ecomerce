import { ApiProperty } from "@nestjs/swagger";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Candidato } from "./candidato.entity";
import { User } from "src/auth/entities/user.entity";




@Entity()
export class Vacante {
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
    })
    @Column('text')
    titulo:string;


    @ApiProperty({
        example:'T-shirt-color-blanco',
        description:'Referencia para ceo'
    })
    @Column('text')
    slug:string;

    @ApiProperty({
        example:'T-shirt color blanco, logo vengadores.',
        description:'Descripción del producto',
        nullable:true
    })
    @Column({
        type:'text',
        nullable:true,
        
    })
    empresa:string;


    @ApiProperty({
        example:'T-shirt color blanco, logo vengadores.',
        description:'Descripción del producto',
        nullable:true
    })
    @Column({
        type:'text',
        nullable:true,
        
    })
    ubicacion:string;

    @ApiProperty({
        example:'T-shirt color blanco, logo vengadores.',
        description:'Descripción del producto',
        nullable:true
    })
    @Column({
        type:'text',
        nullable:true,
        
    })
    salario:string;

    @ApiProperty({
        example:'T-shirt color blanco, logo vengadores.',
        description:'Descripción del producto',
        nullable:true
    })
    @Column({
        type:'text',
        nullable:true,
        
    })
    contrato:string;

    @ApiProperty({
        example:'T-shirt color blanco, logo vengadores.',
        description:'Descripción del producto',
        nullable:true
    })
    @Column({
        type:'text',
        nullable:true,
    })
    estado:string;



    @ApiProperty({
        example:'T-shirt color blanco, logo vengadores.',
        description:'Descripción del producto',
        nullable:true
    })
    @Column({
        type:'text',
        nullable:true,
        
    })
    descripcion:string;

    @ApiProperty({
        example:'descripcion del comentario',
        description:'descripcion del comentario'
    })
    @Column('text',{
        array:true,
        default:[]
    })
    skills:string[];

    @CreateDateColumn({ type: 'timestamptz',default: () => "CURRENT_TIMESTAMP(6)"  })
    createdAt: Date;


    @ApiProperty({
        example:"http://localhost:3000/api/v1/files/product/6f77b86c-cc9a-4848-b982-e2f382a69ec3.png",
        description:'Retornara una o un arreglo de images'
    })
    @OneToMany(
        ()=>Candidato,
        (candidato)=>candidato.vacante,
        {cascade:true,eager:true}
    )
    candidatos?:Candidato[];

    @ApiProperty({
        example:User,
        description:'Retornara un usuario relacionado'
    })
    @ManyToOne(
        ()=>User,
        (user)=>user.vacante,
        {eager:true}
    )
    user:User;

 

    @BeforeInsert()
    checkSlugInsert(){
        if(!this.slug){
          this.slug=this.titulo
        }

        this.slug=this.slug
          .toLocaleLowerCase()
          .replaceAll(' ','_')
          .replaceAll("'",'')
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim()
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        if(!this.slug){
          this.slug=this.titulo
        }

        this.slug=this.slug
          .toLocaleLowerCase()
          .replaceAll(' ','_')
          .replaceAll("'",'')
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim()
    }


}
