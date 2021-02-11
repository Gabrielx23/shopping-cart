import {BadRequestException, NotFoundException} from '@nestjs/common';

export class ProductException {
  public static productNotExist(): NotFoundException {
    return new NotFoundException('Product not exist!');
  }

  public static productImageIsRequired(): BadRequestException {
    return new BadRequestException('Product image is required!');
  }
}