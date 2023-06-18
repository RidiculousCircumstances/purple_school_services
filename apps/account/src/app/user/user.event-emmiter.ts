import { Injectable } from "@nestjs/common";
import { UserEntity } from "./entities/user.entity";
import { RMQService } from "nestjs-rmq";

@Injectable()
export class UserEventEmmiter {
    constructor(private readonly rmqService: RMQService) { }

    async handle(user: UserEntity) {
        for (const event of user.events) {
            this.rmqService.notify(event.topic, event.data);
        }

    }
}