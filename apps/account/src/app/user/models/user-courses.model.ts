import { Document } from 'mongoose';
import { IUser, IUserCourse, PurchaseState, UserRole } from '@purple-services/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserCourses extends Document implements IUserCourse {
    @Prop({ required: true })
    courseId: string;
    @Prop({ required: true, enum: PurchaseState, type: String })
    purchaseState: PurchaseState;
}

export const UserCoursesSchema = SchemaFactory.createForClass(UserCourses);