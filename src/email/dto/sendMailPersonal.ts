


import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";




export class SendEmailPersonalDto {

    @IsNotEmpty()
    @IsString()
    nombre:string;

    @IsString()
    @IsOptional()
    compania?:string;

    @IsString()
    @IsOptional()
    email?:string;

    @IsString()
    @IsOptional()
    mensaje?:string;
}
