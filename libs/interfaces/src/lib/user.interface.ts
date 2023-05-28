export enum UserRole {
    Teacher = 'Teacher',
    Student = 'Student'
}

export enum PurchaseState {
    Started = 'Started',
    WaitingForPayment = 'WaitingForPayment',
    Purchased = 'Purchased',
    Canceled = 'Canceled',
}


export interface IUser {
    _id?: string;
    displayedName?: string;
    email: string;
    hashedPassword?: string;
    role: UserRole;
    courses?: IUserCourse[];

}

export interface IUserCourse {
    _id?: string;
    courseId: string;
    purchaseState: PurchaseState;
}