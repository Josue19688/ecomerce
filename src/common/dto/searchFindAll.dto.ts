




import { ApiProperty } from "@nestjs/swagger";
import {  IsOptional, IsPositive, Min, isString } from "class-validator";


export class SearchFindAllDto{
    
    @ApiProperty({
        description:'Colleccion de modelos a buscar'
    })
    @IsOptional()
    modelo?:string;


    @ApiProperty({
        description:'Termino a buscar'
    })
    @IsOptional()
    termino?:string;
    
    
}