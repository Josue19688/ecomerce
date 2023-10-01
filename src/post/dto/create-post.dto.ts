import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";




export class CreatePostDto {
    @ApiProperty({
        description:'Titulo del post',
        nullable:false,
        minLength:1
    })
    @IsString()
    title:string;


    @ApiProperty({
        description:'Descripción ',
        nullable:true
    })
    @IsString()
    @IsOptional()
    descripcion?:string;

    @ApiProperty({
        description:'Arreglo de imagenes ',
        nullable:true
    })
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    images?:string[];

    @ApiProperty({
        description:'Hora de ingreso',
        nullable:true
    })
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    comentarios?:string[];

    @ApiProperty({
        description:'Usuario realizo el comentario',
        nullable:true
    })
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    userComentario?:string[];

}
