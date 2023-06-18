import { AccountChangeCourse } from "@purple-services/contracts";
import { IDomainEvent, IUser, IUserCourse, PurchaseState, UserRole } from "@purple-services/interfaces";
import { compare } from "bcryptjs";
import { genSalt, hash } from "bcryptjs";

export class UserEntity implements IUser {
    _id?: string;
    displayedName?: string;
    email: string;
    hashedPassword?: string;
    role: UserRole;
    courses?: IUserCourse[];
    events: IDomainEvent[] = [];

    constructor(user: IUser) {
        this._id = user._id;
        this.displayedName = user.displayedName;
        this.email = user.email;
        this.role = user.role;
        this.hashedPassword = user.hashedPassword;
        this.courses = user.courses;
    }

    /**
     * Обновить состояние произвольного курса
     * @param courseId 
     * @param state 
     */
    public setCourseStatus(courseId: string, state: PurchaseState) {

        const exist = this.courses.find(c => c._id === courseId);
        if (!exist) {
            this.courses.push({
                courseId,
                purchaseState: state
            });
            return this;
        }

        if (state === PurchaseState.Canceled) {
            this.courses = this.courses.filter(c => c._id !== courseId);
            return this;
        }

        this.courses = this.courses.map(c => {
            if (c._id !== courseId) {
                return c;
            }
            c.purchaseState = state;
            return c;
        });
        this.events.push({
            topic: AccountChangeCourse.topic,
            data: {
                courseId,
                userId: this._id,
                state,
            }
        });

        return this;
    }

    public getPublicProfile() {
        return {
            email: this.email,
            displayedName: this.displayedName,
            role: this.role
        }
    }

    public async setPassword(password: string) {
        const salt = await genSalt(10);
        this.hashedPassword = await hash(password, salt);
        return this;
    }

    public async validatePassword(password: string) {
        return compare(password, this.hashedPassword);
    }

    public updateProfile(displayedName: string) {
        this.displayedName = displayedName;
        return this;
    }
}