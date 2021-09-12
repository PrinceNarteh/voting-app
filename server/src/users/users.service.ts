import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, scrypt as _script } from 'crypto';

import { ErrorResponse } from 'src/shared/error.response';
import { promisify } from 'util';
import { SignUpInput } from './dto/signup.input';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

const scrypt = promisify(_script);

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
    const userExist = await this.usersRepository.findOne({ where: { email } });
    console.log(userExist);
    if (userExist) {
      return [
        {
          path: 'email',
          message: 'invalid email or password',
        },
      ];
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const hashedPassword = salt + '.' + hash.toString('hex');

    const user = this.usersRepository.create({
      ...signUpInput,
      password: hashedPassword,
    });
    await this.usersRepository.save(user);
    return null;
  }
}
