import { CourseGetCourse, PaymentCheck, PaymentGenerateLink, PaymentStatus } from '../../../../../../libs/contracts/src';
import { PurchaseState } from '../../../../../../libs/interfaces/src';
import { UserEntity } from '../entities/user.entity';
import { BuyCourseSagaState } from './buy-course.state';

export class BuyCourseSagaStateStarted extends BuyCourseSagaState {
    public async pay(): Promise<{ paymentLink: string; user: UserEntity; }> {

        const user = this.saga.user;
        const courseId = this.saga.courseId;

        const { course } = await this.saga.rmqService.
            send<CourseGetCourse.Request, CourseGetCourse.Response>(CourseGetCourse.topic, {
                id: courseId,
            });

        if (!course) {
            throw new Error('Course does not exist');
        }

        if (course.price === 0) {
            this.saga.setState(PurchaseState.Purchased, courseId);
            return { paymentLink: null, user };
        }

        const { paymentLink } = await this.saga.rmqService.
            send<PaymentGenerateLink.Request, PaymentGenerateLink.Response>(PaymentGenerateLink.topic, {
                courseId,
                userId: user._id,
                sum: course.price,
            });

        this.saga.setState(PurchaseState.WaitingForPayment, courseId);

        return { paymentLink, user };

    }

    public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
        throw new Error(`Сan't check a payment that hasn't started`);
    }

    public async cancel(): Promise<{ user: UserEntity; }> {
        const courseId = this.saga.courseId;
        const user = this.saga.user;

        this.saga.setState(PurchaseState.Canceled, courseId);
        return { user };
    }

}

export class BuyCourseSagaStateWaitingForPayment extends BuyCourseSagaState {
    public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
        throw new Error(`Can't create payment link during payment processing`);
    }
    public async checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {

        const userId = this.saga.user._id;
        const user = this.saga.user;
        const courseId = this.saga.courseId;

        const { status } = await this.saga.rmqService
            .send<PaymentCheck.Request, PaymentCheck.Response>(PaymentCheck.topic, {
                userId,
                courseId
            });

        if (status === 'canceled') {
            this.saga.setState(PurchaseState.Canceled, courseId);
            return { user, status: 'canceled' };
        }

        if (status !== 'success') {
            return { user, status: 'success' };
        }

        this.saga.setState(PurchaseState.Purchased, courseId);
        return { user, status: 'progress' };

    }

    public async cancel(): Promise<{ user: UserEntity; }> {
        throw new Error(`Can't cancel payment in process`);
    }

}

export class BuyCourseSagaStatePurchased extends BuyCourseSagaState {
    public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
        throw new Error(`Can't create payment link after payment succeeded`);
    }
    public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
        throw new Error(`Can't check payment after payment succeeded`);
    }
    public cancel(): Promise<{ user: UserEntity; }> {
        throw new Error(`There is no possibility to cancel finised`);
    }

}

export class BuyCourseSagaStateCanceled extends BuyCourseSagaState {
    public async pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
        const courseId = this.saga.courseId;
        this.saga.setState(PurchaseState.Started, courseId);
        return this.saga.getState().pay();
    }

    public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
        throw new Error(`Can't check payment for cacneled course`);
    }
    public cancel(): Promise<{ user: UserEntity; }> {
        throw new Error(`There is no possibility to cancel canceled course`);
    }

}
