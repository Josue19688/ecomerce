


import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class UpdateUserDto{

    @IsString()
    @IsEmail()
    @IsOptional()
    email?:string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @IsOptional()
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe tener una letra mayúscula, minúscula y un número.'
    })
    password?:string;

    @IsString()
    @MinLength(1)
    @IsOptional()
    fullName?:string;

    @IsBoolean()
    @IsOptional()
    isActive?:boolean;

    @IsString({each:true})
    @IsArray()
    @IsOptional()
    roles?:string[];

    @ApiProperty({
        description:'Arreglo de imagenes del producto',
        nullable:true
    })
    @IsString({each:true})
    @IsArray()
    @IsOptional()
    images?:string[];
}