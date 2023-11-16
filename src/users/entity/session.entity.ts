import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Session extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: Boolean, required: true, default: false })
  activeStatus: boolean;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
