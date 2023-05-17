import { IUser, UserRole } from "@purple-services/interfaces";
import { compare } from "bcryptjs";
import { genSalt, hash } from "bcryptjs";

export class UserEntity implements IUser {
    _id?: string;
    displayedName?: string;
    email: string;
    hashedPassword?: string;
    role: UserRole;

    constructor(user: IUser) {
        this._id = user._id;
        this.displayedName = user.displayedName;
        this.email = user.email;
        this.role = user.role;
    }

    public async setPassword(password: string) {
        const salt = await genSalt(10);
        this.hashedPassword = await hash(password, salt);
        return this;
    }

    public async validatePassword(password: string) {
        return compare(password, this.hashedPassword);
    }
}