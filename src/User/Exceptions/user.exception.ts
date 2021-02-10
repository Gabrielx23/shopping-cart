import {BadRequestException, NotFoundException} from '@nestjs/common';

export class UserException {
  public static credentialsAlreadyInUse(): NotFoundException {
    return new BadRequestException('Selected credentials are already in use!');
  }

  public static wrongCredentials(): NotFoundException {
    return new BadRequestException('Wrong credentials provided!');
  }
}