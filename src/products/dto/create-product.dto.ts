import { ApiProperty } from "@nestjs/swagger";
import { 
    IsArray, 
    IsIn, 
    IsInt, 
    IsNumber, 
    IsOptional, 
    IsPositive, 
    IsString, 
    MinLength 
} from "class-validator";

export class CreateProductDto {

    @ApiProperty({
        description:'Titulo del producto.',
        nullable:false,
        minLength:1
    })
    @IsString()
    @MinLength(1)
    title:string;

    @ApiProperty({
        description:'Precio del producto',
        default:0,
        nullable:true
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?:number;

    @ApiProperty({
        description:'Descripción del producto',
        nullable:true
    })
    @IsString()
    @IsOptional()
    description?:string;

    @ApiProperty({
        description:'Titulo para el ceo',
        nullable:true
    })
    @IsString()
    @IsOptional()
    slug?:string;

    @ApiProperty({
        description:'Productos en existencia.',
        default:0,
        nullable:true
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?:number;

    @ApiProperty({
        description:'Tamanos del producto',
        nullable:false
    })
    @IsString({each:true})
    @IsArray()
    sizes:string[];

    @ApiProperty({
        description:'Genero del producto',
        nullable:false,
    })
    @IsIn(['men','women','kid','unisex'])
    gender:string;

    @ApiProperty({
        description:'Tags identificadores del producto',
        nullable:true
    })
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    tags?:string[];

    @ApiProperty({
        description:'Arreglo de imagenes del producto',
        nullable:true
    })
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    images?:string[];


}
