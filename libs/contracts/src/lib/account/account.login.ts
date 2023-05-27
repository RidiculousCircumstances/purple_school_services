import { IsEmail, IsString, MinLength } from 'class-validator';

export namespace AccountLogin {
    export const topic = 'account.login.command';

    export class Request {

        @IsEmail()
        email: string;

        @IsString()
        @MinLength(8)
        password: string;
    }

    export class Response {
        accessToken: string;
    }
}