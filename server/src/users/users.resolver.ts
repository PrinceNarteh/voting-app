import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ErrorResponse } from 'src/shared/error.response';
import { SignUpInput } from './dto/signup.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query((returns) => [User], { name: 'users' })
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Mutation((returns) => [ErrorResponse], { nullable: true })
  signUp(@Args('signUpInput') signUpInput: SignUpInput) {
    return this.usersService.create(signUpInput);
  }
}
