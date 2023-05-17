import { Document } from 'mongoose';
import { IUser, UserRole } from '@purple-services/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User extends Document implements IUser {

    @Prop()
    displayedName?: string;
    @Prop({ required: true })
    email: string;
    @Prop({ required: true })
    hashedPassword: string;
    @Prop({ required: true, enum: UserRole, type: String, default: UserRole.Student })
    role: UserRole;

}

export const UserSchema = SchemaFactory.createForClass(User);