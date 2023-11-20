import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SignUpRequestDTO, LoginRequestDto, ValidateRequestDto, LogoutRequestDto } from './users.dto';
import { USERS_SERVICE_NAME, SignUpResponse, LoginResponse, ValidateResponse, LogoutResponse, GetBalanceResponse, WALLET_SERVICE_NAME, UpdateBalanceResponse, UpdateBalanceRequest, GetBalanceRequest, forgetPasswordRequest, forgetPasswordResponse, resetPasswordRequest, resetPasswordResponse, changePasswordRequest, changePasswordResponse } from './users.pb';
import { UsersService } from './service/users.service';

@Controller()
export class UsersController {
    @Inject(UsersService)
    private readonly service: UsersService;

    @GrpcMethod(USERS_SERVICE_NAME, 'signUp')
    private signUp(payload: SignUpRequestDTO): Promise<SignUpResponse> {
        return this.service.signUp(payload);
    }

    @GrpcMethod(USERS_SERVICE_NAME, 'login')
    private login(payload: LoginRequestDto): Promise<LoginResponse> {
        return this.service.login(payload);
    }

    @GrpcMethod(USERS_SERVICE_NAME, 'Validate')
    private validate(payload: ValidateRequestDto): Promise<ValidateResponse> {
        return this.service.validate(payload);
    }

    @GrpcMethod(USERS_SERVICE_NAME,'forgetPassword')
    private forgetPassword(payload:forgetPasswordRequest):Promise<forgetPasswordResponse> {
        return this.service.forgetPassword(payload);
    }

    @GrpcMethod(USERS_SERVICE_NAME,'resetPassword')
    private resetPassword(payload:resetPasswordRequest): Promise<resetPasswordResponse> {
        return this.service.resetPassword(payload);
    }

    @GrpcMethod(USERS_SERVICE_NAME,'changePassword')
    private changePassword(payload:changePasswordRequest): Promise<changePasswordResponse> {
    return this.service.changePassword({...payload, userId:payload.userId});
    }

    @GrpcMethod(USERS_SERVICE_NAME, 'Logout')
    private logout(payload: any): Promise<LogoutResponse> {
    return this.service.logout(payload.userId);
    }

    @GrpcMethod(WALLET_SERVICE_NAME, 'getBalance')
    private getBalance(payload: GetBalanceRequest): Promise<GetBalanceResponse> {
        return this.service.getBalance(payload);
    }

    @GrpcMethod(WALLET_SERVICE_NAME, 'updateBalance')
    private async updateBalance(payload:UpdateBalanceRequest): Promise<UpdateBalanceResponse> {
        return this.service.updateBalance(payload);
    }
}

