import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsPositive, Min, isString } from "class-validator";


export class SearchDto{

    @ApiProperty({
        default:10,
        description:'Fecha inicio search'
    })
    @IsOptional()
    inicio?:string;
    

    @ApiProperty({
        default:0,
        description:'Fecha final search'
    })
    @IsOptional()
    fin?:string;
    
    @ApiProperty({
        description:'Colleccion de modelos a buscar'
    })
    @IsOptional()
    modelo?:string;

}