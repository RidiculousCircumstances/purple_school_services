import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class LoginDTO {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
}