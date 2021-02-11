import {ForbiddenException, NotFoundException} from '@nestjs/common';

export class BasketException {
  public static basketElementNotExist(): NotFoundException {
    return new NotFoundException('Basket element not exist!');
  }

  public static onlyBasketOwnerCanProceedThisAction(): ForbiddenException {
    return new ForbiddenException('Only basket owner can proceed this action!');
  }
}