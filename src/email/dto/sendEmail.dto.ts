import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";




export class SendEmailDto {
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    to:string;

    @IsNotEmpty()
    @IsString()
    subject:string;

    @IsString()
    @IsOptional()
    template?:string;

    @IsString()
    @IsOptional()
    url?:string;

    @IsString()
    @IsOptional()
    token?:string;
}
