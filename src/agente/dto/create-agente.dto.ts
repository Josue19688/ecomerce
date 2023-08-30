import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";




export class CreateAgenteDto {

    @ApiProperty({
        description:'Nombre de la persona',
        nullable:false,
        minLength:1
    })
    @IsString()
    nombre:string;

    @ApiProperty({
        description:'DPI de la persona',
        nullable:false,
        minLength:1
    })
    @IsString()
    dpi:string;

    @ApiProperty({
        description:'Nacimiento de la persona',
        nullable:false,
        minLength:1
    })
    @IsString()
    nacimiento:string;

    @ApiProperty({
        description:'Telefono de la persona',
        nullable:false,
        minLength:1
    })
    @IsString()
    telefono:string;

    @ApiProperty({
        description:'Correo de la persona',
        nullable:false,
        minLength:1
    })
    @IsString()
    correo:string;

    @ApiProperty({
        description:'Direccion de la persona',
        nullable:false,
        minLength:1
    })
    @IsString()
    direccion:string;

    @ApiProperty({
        description:'Igss de la persona',
        nullable:false,
        minLength:1
    })
    @IsString()
    igss:string;

    @ApiProperty({
        description:'Nit de la persona',
        nullable:false,
        minLength:1
    })
    @IsString()
    nit:string;

    @ApiProperty({
        description:'Sangre de la persona',
        nullable:false,
        minLength:1
    })
    @IsString()
    sangre:string;

    @ApiProperty({
        description:'Puesto de la persona',
        nullable:false,
        minLength:1
    })
    @IsString()
    puesto:string;

    @ApiProperty({
        description:'Grupo de la persona',
        nullable:false,
        minLength:1
    })
    @IsString()
    grupo:string;

    @ApiProperty({
        description:'Estado de la persona',
        nullable:false,
        minLength:1
    })
    @IsString()
    estado:string;

    @ApiProperty({
        description:'Arreglo de imagenes ',
        nullable:true
    })
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    images?:string[];
}
