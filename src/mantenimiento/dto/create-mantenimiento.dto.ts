

import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";
import { Inventario } from "src/inventario/entities/inventario.entity";


export class CreateMantenimientoDto {

    @ApiProperty({
        description:'Division a quien se hizo el soporte',
        nullable:false,
        minLength:1
    })
    @IsString()
    division:string;

    @ApiProperty({
        description:'Ip del equipo',
        nullable:false,
        minLength:1
    })
    @IsString()
    @IsOptional()
    ip?:string;

    @ApiProperty({
        description:'Sede a quien se hizo el soporte',
        nullable:false,
        minLength:1
    })
    @IsString()
    sede:string;

    @ApiProperty({
        description:'Estado del equipo o si esta en bodega',
        nullable:false,
        minLength:1
    })
    @IsString()
    estado:string;

    @ApiProperty({
        description:'Tipo de servicio que se le realizo',
        nullable:false,
        minLength:1
    })
    @IsString()
    tipoServicio:string;

    @ApiProperty({
        description:'Fecha del soporte',
        nullable:true
    })
    
    @IsOptional()
    fecha:Date;

    @ApiProperty({
        description:'Tecnico que realizo el soporte',
        nullable:false,
        minLength:1
    })
    @IsString()
    tecnico:string;

    
    @ApiProperty({
        description:'Descripcion del equipo',
        nullable:false,
        minLength:1
    })
    @IsString()
    @IsOptional()
    descripcion:string;

    @ApiProperty({
        description:'identificador del equipo al cual se le da mantenimiento',
        minLength:1
    })
    @IsString()
    inventario:Inventario;
}
