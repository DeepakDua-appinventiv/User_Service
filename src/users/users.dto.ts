import { IsString, IsEmail, IsISO8601 } from 'class-validator';
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { SignUpRequest, LoginRequest,ValidateRequest, LogoutRequest } from './users.pb';

export class LoginRequestDto implements LoginRequest {
    @IsEmail()
    public readonly email: string;
  
    @IsString()
    public readonly password: string;
  }

export class SignUpRequestDTO  implements SignUpRequest{
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsISO8601()
  dateOfBirth: string;

  @IsString() 
  phoneNumber: string;
}


export class ValidateRequestDto implements ValidateRequest {
    @IsString()
    public readonly token: string;
}

export class LogoutRequestDto implements LogoutRequest {
    @IsString()
    public readonly token: string;
}


