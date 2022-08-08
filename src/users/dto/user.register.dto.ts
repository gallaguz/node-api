import { UserCredentials } from './user.credentials';
import { IsString } from 'class-validator';

export class UserRegisterDto extends UserCredentials {
    @IsString({ message: 'Enter name' })
    name: string;
}
