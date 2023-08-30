import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";



export class CreateVisitaDto {

    @ApiProperty({
        description:'Tipo de visita',
        nullable:false,
        minLength:1
    })
    @IsString()
    tipo:string;

    @ApiProperty({
        description:'Lugar de ingreso',
        nullable:false,
        minLength:1
    })
    @IsString()
    puesto:string;

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
        description:'Nombre de la empresa',
        nullable:true
    })
    @IsString()
    @IsOptional()
    empresa?:string;

    @ApiProperty({
        description:'Nombre del empleado',
        nullable:true
    })
    @IsString()
    @IsOptional()
    empleado:string;


    @ApiProperty({
        description:'Arreglo de fechas',
        nullable:false
    })
    @IsString({each:true})
    @IsArray()
    fechas?:string[];

    @ApiProperty({
        description:'Hora de ingreso',
        nullable:true
    })
    @IsString()
    @IsOptional()
    ingreso?:Date;

    @ApiProperty({
        description:'Hora de salida'
    })
    @IsString()
    @IsOptional()
    salida?:Date;

    isActive?:boolean;

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
