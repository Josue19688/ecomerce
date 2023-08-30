import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";


export class CreateArchivoDto {

    @ApiProperty({
        description:'Tipo de novedad',
        nullable:false,
        minLength:1
    })
    @IsString()
    tipo:string;

    @ApiProperty({
        description:'CC-074-2023-SEG',
        nullable:false,
        minLength:1
    })
    @IsString()
    correlativo:string;


    @ApiProperty({
        description:'INGRESO/SALIDA',
        nullable:false,
        minLength:1
    })
    @IsString()
    clasificacion:string;

    @ApiProperty({
        example:'Unidad',
        description:'Unidad o departamento'
    })
    @IsString()
    unidad:string;

    @ApiProperty({
        example:'2023-10-10',
        description:'Fecha del documento'
    })
    @IsString()
    fecha:string;

    @ApiProperty({
        example:'Descripcion del documento.',
        description:'Descripción',
        nullable:true
    })
    @IsString()
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
