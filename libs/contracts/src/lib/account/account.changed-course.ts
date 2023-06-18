import { PurchaseState } from '@purple-services/interfaces';
import { IsString } from 'class-validator';
import { PaymentStatus } from '../payment/payment.check';

export namespace AccountChangeCourse {
    export const topic = 'account.changed-course.event';

    export class Request {

        @IsString()
        userId: string;

        @IsString()
        courseId: string;

        state: PurchaseState;

    }

}