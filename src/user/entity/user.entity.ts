import { User } from '@prisma/client';
import { compare, hash } from 'bcryptjs';

import { Trace } from '@app/decorators';
import { IUserEntity } from '@app/user';

export class UserEntity implements IUserEntity {
    model: User;

    private _passwordHash: string;

    constructor(private _name: string, private _email: string) {}

    get name(): string {
        return this._name;
    }

    private setName(name: string): void {
        this._name = name;
    }

    get email(): string {
        return this._email;
    }

    private setEmail(email: string): void {
        this._email = email;
    }

    get password(): string {
        return this._passwordHash;
    }

    public setPassword(passwordHash: string): void {
        this._passwordHash = passwordHash;
    }

    @Trace()
    public async hash(password: string, salt: number): Promise<string> {
        return hash(password, salt);
    }

    @Trace()
    public async compare(password: string): Promise<boolean> {
        return compare(password, this._passwordHash);
    }

    private exclude<Key extends keyof User>(keys: string[]): Omit<User, Key> {
        return Object.fromEntries(
            Object.entries(this.model).filter(([key]) => !keys.includes(key)),
        ) as Omit<User, Key>;
    }

    public toJSON(): Partial<User> {
        return this.exclude(['password']);
    }
}

export class UserEntityFromModel extends UserEntity {
    constructor(user: User) {
        super(user.name, user.email);
        this.model = user;
    }
}
