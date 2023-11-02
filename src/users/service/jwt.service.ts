import { Injectable } from '@nestjs/common';
import { JwtService as jwt } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../entity/users.entity';

@Injectable()
export class JwtService {
  private readonly jwt: jwt;

  constructor(
    jwt: jwt,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    this.jwt=jwt;
  }

  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token);
  }

  public async validateUser(decoded: any): Promise<User | null> {
    return this.userModel.findById(decoded.id).exec();
  }

  public async generateToken(user: User): Promise<string> {
    const token = await this.jwt.sign({ id: user._id, email: user.email });
    return token;
  }

  public async isPasswordValid(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, userPassword);
  }

  public async encodePassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  public async verify(token: string): Promise<any> {
    try {
      return await this.jwt.verify(token);
    } catch (err) {
      throw err;
    }
  }
}
