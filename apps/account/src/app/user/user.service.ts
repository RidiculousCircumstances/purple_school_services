import { Injectable, NotFoundException } from "@nestjs/common";
import { IUser } from "@purple-services/interfaces";
import { UserRepository } from "./repositiories/user.repository";
import { RMQService } from "nestjs-rmq";
import { UserEntity } from "./entities/user.entity";
import { BuyCourseSaga } from "./sagas/buy-course.saga";
import { UserEventEmmiter } from "./user.event-emmiter";

@Injectable()
export class UserService {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly rmqService: RMQService,
        private readonly emmiter: UserEventEmmiter) {
    }

    private async updateUser(user: UserEntity) {
        return Promise.all([
            this.userRepository.updateUser(user),
            this.emmiter.handle(user),
        ]);
    }


    public async changeProfile(user: Pick<IUser, 'displayedName'>, id: string) {
        const existedUser = await this.userRepository.findUserById(id);
        if (!existedUser) {
            throw new NotFoundException();
        }

        const userEntity = new UserEntity(existedUser).updateProfile(user.displayedName);
        await this.updateUser(userEntity);
        return {};
    }

    public async buyCourse(userId: string, courseId: string) {
        const foundUser = await this.userRepository.findUserById(userId);
        if (!foundUser) {
            throw new NotFoundException('There is no specified user');
        }

        const userEntity = new UserEntity(foundUser);

        const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
        const { user, paymentLink } = await saga.getState().pay();
        await this.updateUser(user);

        return { paymentLink };

    }

    public async checkPayment(userId: string, courseId: string) {
        const foundUser = await this.userRepository.findUserById(userId);
        if (!foundUser) {
            throw new NotFoundException('There is no specified user');
        }

        const userEntity = new UserEntity(foundUser);
        const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);

        const { user, status } = await saga.getState().checkPayment();
        await this.updateUser(user);

        return { status };

    }

}