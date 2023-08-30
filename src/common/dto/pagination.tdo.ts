import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto{

    @ApiProperty({
        description:'Parametro de limite de paginación'
    })
    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Type(()=>Number)
    limit?:number;
    

    @ApiProperty({
        description:'Parametro de inicio de paginación'
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(()=>Number)
    offset?:number;
}