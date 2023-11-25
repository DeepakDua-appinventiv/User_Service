import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { User, UserSchema } from './entity/users.entity';
import { UsersService } from './service/users.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletSchema } from './entity/wallet.entity';
import { SessionSchema } from './entity/session.entity';
import { RedisModule } from 'src/providers/redis.module';
import config from 'src/common/config.common';
import { JwtService } from './service/jwt.service';

@Module({
  imports: [
    RedisModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Wallet', schema: WalletSchema },
      { name: 'Session', schema: SessionSchema }
    ]),
    JwtModule.register({
      secret: config.SECRET_KEY,
      signOptions: {expiresIn: '2h'}
    })
  ],
  controllers: [UsersController],
  providers: [UsersService,JwtService, JwtStrategy],
})
export class UsersModule {}
