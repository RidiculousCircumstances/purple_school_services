export enum UserRole {
    Teacher = 'Teacher',
    Student = 'Student'
}


export interface IUser {
    _id?: string;
    displayedName?: string;
    email: string;
    hashedPassword?: string;
    role: UserRole;

}