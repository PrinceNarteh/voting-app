import { Resolver, Query } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query((returns) => [User], { name: 'users' })
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
