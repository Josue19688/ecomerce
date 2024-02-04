import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";



export class CreateInventarioDto {
    @ApiProperty({
        description:'Service tag del equipo',
        nullable:false,
        minLength:1
    })
    @IsString()
    serviceTag:string;

    @ApiProperty({
        description:'Numero de inventario',
        nullable:false,
        minLength:1
    })
    @IsString()
    numeroInventario:string;

    @ApiProperty({
        description:'Nombre de la persona a quien esta asignado',
        minLength:1
    })
    @IsString()
    @IsOptional()
    asignado?:string;

    @ApiProperty({
        description:'Tipo de equipo',
        minLength:1
    })
    @IsString()
    @IsOptional()
    tipo:string;

    @ApiProperty({
        description:'Marca del equipo',
        minLength:1
    })
    @IsString()
    @IsOptional()
    marca:string;

    @ApiProperty({
        description:'Division asignado el equipo',
        nullable:false,
        minLength:1
    })
    @IsString()
    division:string;

    @ApiProperty({
        description:'Departamento asignado el equipo',
        minLength:1
    })
    @IsString()
    @IsOptional()
    departamento?:string;

    @ApiProperty({
        description:'Sede asignado el equipo',
        minLength:1
    })
    @IsString()
    @IsOptional()
    sede?:string;

    @ApiProperty({
        description:'Ubicacion actual del equipo',
        minLength:1
    })
    @IsString()
    @IsOptional()
    ubicacion?:string;

    @ApiProperty({
        description:'Descripcion del equipo',
        nullable:false,
        minLength:1
    })
    @IsString()
    @IsOptional()
    descripcion:string;

    @ApiProperty({
        description:'Arreglo de imagenes ',
        nullable:true
    })
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    images?:string[];
}
