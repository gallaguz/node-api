import { IsNumber, IsString, IsUUID } from 'class-validator';

export class RefreshTokenDto {
    @IsString({ message: 'Wrong Refresh Token' })
    refreshToken: string;

    @IsUUID()
    userId: string;

    @IsNumber()
    iat: number;

    @IsNumber()
    exp: number;
}
