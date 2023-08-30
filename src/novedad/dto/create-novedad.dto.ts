import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString, MinLength } from "class-validator";




export class CreateNovedadDto {

    @ApiProperty({
        description:'Tipo de novedad',
        nullable:false,
        minLength:1
    })
    @IsString()
    tipo:string;

    @ApiProperty({
        description:'Arreglo de nombres',
        nullable:false
    })
    @IsString({each:true})
    @IsArray()
    nombre?:string[];


    @ApiProperty({
        description:'Arreglo de dpi',
        nullable:false
    })
    @IsString({each:true})
    @IsArray()
    dpi?:string[];

    @ApiProperty({
        description:'Arreglo de placas',
        nullable:false
    })
    @IsString({each:true})
    @IsArray()
    placa?:string[];


    @ApiProperty({
        description:'Fecha de la novedad',
        nullable:true
    })
    
    @IsOptional()
    fecha:Date;

    @ApiProperty({
        description:'Hora de novedad',
        nullable:true
    })
    @IsString()
    @IsOptional()
    hora:string;

    @ApiProperty({
        description:'Puesto de servicio',
        nullable:true
    })
    @IsString()
    @IsOptional()
    puesto?:string;

    @ApiProperty({
        description:'Preliminar de la novedad ',
        nullable:true
    })
    @IsString()
    @IsOptional()
    preliminar?:string;

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


}
