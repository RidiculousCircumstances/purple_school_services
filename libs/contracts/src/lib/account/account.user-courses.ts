import { IUserCourse } from '@purple-services/interfaces';
import { IsString } from 'class-validator';

export namespace AccountUserCoursesInfo {
    export const topic = 'account.user-courses.query';

    export class Request {
        @IsString()
        id: string;
    }

    export class Response {
        courses: IUserCourse[];
    }
}