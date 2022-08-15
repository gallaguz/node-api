import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
    @IsString({ message: 'Wrong name' })
    name: string;

    @IsEmail({}, { message: 'Wrong email' })
    email: string;

    @IsString({ message: 'Wrong password' })
    password: string;
}
