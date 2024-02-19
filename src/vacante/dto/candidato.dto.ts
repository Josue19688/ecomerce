


import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";


export class CreateCandidatoDto {

    @ApiProperty({
        description:'Titulo del post',
        nullable:false,
        minLength:1
    })
    @IsString()
    nombre:string;

    @ApiProperty({
        description:'Titulo para el ceo',
        nullable:true
    })
    @IsString()
    @IsOptional()
    email?:string;

    @ApiProperty({
        description:'Descripción del producto',
        nullable:true
    })
    @IsString()
    telefono:string;

   

    @ApiProperty({
        description:'Tamanos del producto',
        nullable:false
    })
    @IsString({each:true})
    @IsArray()
    documentos:string[];
    
}
