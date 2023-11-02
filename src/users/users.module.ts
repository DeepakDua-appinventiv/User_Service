import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { User, UserSchema } from './entity/users.entity';
import { UsersService } from './service/users.service';
// import { JwtService } from '@nestjs/jwt';
import { JwtService } from './service/jwt.service';

import { JwtStrategy } from './strategy/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletSchema } from './entity/wallet.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Wallet', schema: WalletSchema }
    ]),
    JwtModule.register({
      secret: 'dev',
      signOptions: {expiresIn: '2h'}
    })
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService, JwtStrategy],
})
export class UsersModule {}
