import { IsEmail, IsNotEmpty, IsString } from "class-validator";



export class ResetPasswordDto{

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email:string;
}