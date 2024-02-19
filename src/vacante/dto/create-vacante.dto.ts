import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";
import { Candidato } from "../entities/candidato.entity";



export class CreateVacanteDto {

    @ApiProperty({
        description:'Titulo del post',
        nullable:false,
        minLength:1
    })
    @IsString()
    titulo:string;

    @ApiProperty({
        description:'Titulo para el ceo',
        nullable:true
    })
    @IsString()
    @IsOptional()
    slug?:string;

    @ApiProperty({
        description:'Descripción del producto',
        nullable:true
    })
    @IsString()
    empresa:string;

    @ApiProperty({
        description:'Descripción del producto',
        nullable:true
    })
    @IsString()
    @IsOptional()
    ubicacion?:string;

    @ApiProperty({
        description:'Descripción del producto',
        nullable:true
    })
    @IsString()
    @IsOptional()
    salario?:string;

    @ApiProperty({
        description:'Descripción del producto',
        nullable:true
    })
    @IsString()
    @IsOptional()
    contrato?:string;

    @ApiProperty({
        description:'Descripción del producto',
        nullable:true
    })
    @IsString()
    @IsOptional()
    estado?:string;

    @ApiProperty({
        description:'Descripción del producto',
        nullable:true
    })
    @IsString()
    @IsOptional()
    descripcion?:string;


    @ApiProperty({
        description:'Tamanos del producto',
        nullable:false
    })
    @IsString({each:true})
    @IsArray()
    skills:string[];



    @ApiProperty({
        description:'Arreglo candidatos',
        nullable:true
    })
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    candidatos?:Candidato[];



    
}