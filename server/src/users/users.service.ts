import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorResponse } from 'src/shared/error.response';
import { SignUpInput } from './dto/signup.input';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async create(signUpInput: SignUpInput): Promise<ErrorResponse[] | null> {
    const { email, password } = signUpInput;
    const userExist = this.usersRepository.findOne({ where: { email } });
    if (userExist) {
      return [
        {
          path: 'email',
          message: 'invalid email or password',
        },
      ];
    }
    const user = this.usersRepository.create(signUpInput);
    await this.usersRepository.save(user);
    return null;
  }
}
