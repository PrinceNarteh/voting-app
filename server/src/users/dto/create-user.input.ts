import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @MinLength(3, { message: 'Username must have at least 3 characters' })
  @IsString()
  @Field()
  username: string;

  @IsEmail()
  @Field()
  email: string;

  @MinLength(6, { message: 'Password should be at least six(6) characters.' })
  @IsString()
  @Field()
  password: string;
}
