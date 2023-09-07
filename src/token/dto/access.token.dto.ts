import { IsString } from 'class-validator';

export class AccessTokenDto {
    @IsString({ message: 'Wrong Access Token' })
    accessToken: string;
}
