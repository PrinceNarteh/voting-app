import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ErrorResponse } from 'src/shared/error.response';
import { SignUpInput } from './dto/signup.input';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { Email } from '../utils/email';

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
}
