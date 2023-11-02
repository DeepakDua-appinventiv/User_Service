import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './users.entity';

@Schema()
export class Wallet extends Document {
  @Prop({ type: Types.ObjectId, ref:() => User }) 
  userId: Types.ObjectId;

  @Prop()
  walletAmount: number;

  @Prop()
  serviceName: string;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
