import { randomBytes, scrypt as _scrypt } from 'crypto';
import { User } from 'src/users/entities/user.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(event.entity.password, salt, 32)) as Buffer;
    const hashedPassword = `${hash.toString('hex')}.${salt}`;
    event.entity.password = hashedPassword;
  }
}
