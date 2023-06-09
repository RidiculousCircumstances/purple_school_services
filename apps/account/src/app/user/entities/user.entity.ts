import { IUser, IUserCourse, PurchaseState, UserRole } from "@purple-services/interfaces";
import { compare } from "bcryptjs";
import { genSalt, hash } from "bcryptjs";

export class UserEntity implements IUser {
    _id?: string;
    displayedName?: string;
    email: string;
    hashedPassword?: string;
    role: UserRole;
    courses?: IUserCourse[];

    constructor(user: IUser) {
        this._id = user._id;
        this.displayedName = user.displayedName;
        this.email = user.email;
        this.role = user.role;
        this.hashedPassword = user.hashedPassword;
        this.courses = user.courses;
    }

    /**
     * Добавить ссылку на курс, установить дефолтный стейт
     * @param courseId 
     */
    public addCourse(courseId: string) {
        const exist = this.courses.find(c => c._id === courseId);
        if (exist) {
            throw new Error('Course alredy exists');
        }
        this.courses.push({
            courseId,
            purchaseState: PurchaseState.Started
        });
    }


    /**
     * Удалить ссылку на курс
     * @param courseId 
     */
    public deleteCourcse(courseId: string) {
        this.courses = this.courses.filter(c => c._id !== courseId);
    }

    /**
     * Обновить состояние произвольного курса
     * @param courseId 
     * @param state 
     */
    public updateCourseStatus(courseId: string, state: PurchaseState) {
        this.courses = this.courses.map(c => {
            if (c._id !== courseId) {
                return c;
            }
            c.purchaseState = state;
            return c;
        });
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