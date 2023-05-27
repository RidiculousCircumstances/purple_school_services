import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export namespace AccountRegister {
    export const topic = 'account.register.command';

    export class Request {
        @IsEmail()
        email: string;

        @IsString()
        @MinLength(8)
        password: string;

        @IsString()
        @IsOptional()
        displayedName?: string;
    }

    export class Response {
        email: string;
    }
}

