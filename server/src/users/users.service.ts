import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { scrypt as _scrypt } from 'crypto';

import { ErrorResponse } from 'src/shared/error.response';
import { SignUpInput } from './dto/signup.input';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { Email } from '../utils/email';
import { SignInInput } from './dto/signin.input';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private email: Email,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async create(signUpInput: SignUpInput): Promise<ErrorResponse[] | null> {
    const userExist = await this.usersRepository.findOne({
      where: { email: signUpInput.email },
    });
    if (userExist) {
      return [
        {
          path: 'email',
          message: 'invalid email or password',
        },
      ];
    }

    const createdUser = this.usersRepository.create(signUpInput);
    const user = await this.usersRepository.save(createdUser);
    await this.email.sendMail(user.email, user.id);
    return null;
  }

  async signIn(signInInput: SignInInput): Promise<[ErrorResponse] | User> {
    const { email, password } = signInInput;
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      return [
        {
          path: 'email',
          message: 'Invalid email or password',
        },
      ];
    }
    const [storedHash, salt] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      return [
        {
          path: 'email',
          message: 'Invalid email or password',
        },
      ];
    }
    return user;
  }
}
