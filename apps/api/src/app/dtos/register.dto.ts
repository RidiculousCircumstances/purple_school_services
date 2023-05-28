import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDTO {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    @IsOptional()
    displayedName?: string;
}