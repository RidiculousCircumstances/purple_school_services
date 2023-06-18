import { PurchaseState } from "@purple-services/interfaces";
import { UserEntity } from "../entities/user.entity";
import { BuyCourseSaga } from "./buy-course.saga";
import { PaymentStatus } from "@purple-services/contracts";

export abstract class BuyCourseSagaState {
    protected saga: BuyCourseSaga;

    public setContext(saga: BuyCourseSaga) {
        this.saga = saga;
    }

    public abstract pay(): Promise<{ paymentLink: string, user: UserEntity }>;

    public abstract checkPayment(): Promise<{ user: UserEntity, status: PaymentStatus }>;

    public abstract cancel(): Promise<{ user: UserEntity }>;

}