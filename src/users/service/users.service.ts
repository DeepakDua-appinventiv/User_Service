import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from './jwt.service';
import {
  SignUpRequestDTO,
  LoginRequestDto,
  ValidateRequestDto,
} from '../users.dto';
import { User } from '../entity/users.entity';
import { Wallet } from '../entity/wallet.entity';
import { LoginResponse, SignUpResponse, ValidateResponse, GetBalanceResponse, UpdateBalanceResponse } from '../users.pb';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Mongoose } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Wallet.name) private readonly walletModel: Model<Wallet>,
  ) {}

  public async signUp(payload: SignUpRequestDTO): Promise<SignUpResponse> {
    const existingUser = await this.userModel.findOne({ email: payload.email });

    if (existingUser) {
      return { status: HttpStatus.CONFLICT, error: ['E-Mail already exists'] };
    }

    const newUser = new this.userModel({
      name: payload.name,
      email: payload.email,
      password: await this.jwtService.encodePassword(payload.password),
      dateOfBirth: payload.dateOfBirth,
      phoneNumber: payload.phoneNumber,
    });

    await newUser.save();

    const newWalletEntry = new this.walletModel({
      userId: newUser._id,
      walletAmount: 0,
      serviceName: null,
    });

    await newWalletEntry.save();

    return { status: HttpStatus.CREATED, error: null };
  }

  public async login({ email, password }: LoginRequestDto): Promise<LoginResponse> {
    const existingUser = await this.userModel.findOne({ email: email });
    if(!existingUser){
        return { status: HttpStatus.NOT_FOUND, error: ['E-Mail not found'], token: null };
    } 
    const isPasswordValid: boolean = await this.jwtService.isPasswordValid(password, existingUser.password);

    if(!isPasswordValid){
        return { status: HttpStatus.NOT_FOUND, error: ['Wrong Password'], token: null }
    }

    const token: string =await this.jwtService.generateToken(existingUser);
    return { token, status: HttpStatus.OK, error: null };
  }

  public async validate({ token }: ValidateRequestDto): Promise<ValidateResponse>{
    const decoded: User = await this.jwtService.verify(token);

    if(!decoded){
        return { status: HttpStatus.FORBIDDEN, error: ['token is invalid'], userId: null }
    }

    const user: User = await this.jwtService.validateUser(decoded);

    if(!user) {
        return { status: HttpStatus.CONFLICT, error: ['User not found'], userId: null };
    }

    return { status: HttpStatus.OK, error: null, userId: decoded.id };
  }

//   public async logout({userId: string})

  public async getBalance(payload: any): Promise<GetBalanceResponse>{
    console.log(payload)
    const uid = new mongoose.Types.ObjectId(payload.userId);
    const wallet = await this.walletModel.findOne({userId: uid}); //taking userId from token and comparing it from the userId stored in database

    if (!wallet) {
      return { status: HttpStatus.NOT_FOUND, error: ['Wallet not found for the user'], balance: null };
  }
    const balance = wallet.walletAmount;
    return { status: HttpStatus.OK, error:null, balance };
  }
  
  public async updateBalance(payload): Promise<UpdateBalanceResponse> {
    const { walletAmount, serviceName } = payload;

    const updatedWallet = await this.walletModel.findOneAndUpdate(
      { userId },
      {
          $inc: { walletAmount: walletAmount },
          $set: { serviceName }
      },
      { new: true } 
  );

    if (!updatedWallet) {
      return { status: HttpStatus.NOT_FOUND, error: ['Wallet not found for the user'] };
  }

  }
}
