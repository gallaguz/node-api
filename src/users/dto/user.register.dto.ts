import { UserCredentialsDto } from './user.credentials.dto';
import { IsString } from 'class-validator';

export class UserRegisterDto extends UserCredentialsDto {
    @IsString({ message: 'Wrong name' })
    name: string;
}
