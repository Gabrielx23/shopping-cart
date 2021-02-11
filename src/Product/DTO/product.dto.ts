import {IsNotEmpty, IsString, Matches, Min, MinLength} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class ProductDTO {
    @ApiProperty({example: 'Product 1'})
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name: string;

    @ApiProperty({example: '1.11'})
    @IsNotEmpty()
    @Matches(/^\d+(?:[.,]\d+)*$/)
    price: string;

    image;
}
