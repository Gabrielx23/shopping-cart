import {IsNotEmpty, IsNumber, IsOptional, IsUUID, Matches} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class AddBasketElementDTO {
    @ApiProperty({example: '91e56daf-04ef-4bbc-abe7-5d3a8ee41101'})
    @IsUUID()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({example: '1.11'})
    @Matches(/^\d+(?:[.,]\d+)*$/)
    @IsOptional()
    price: string;

    @ApiProperty({example: 5})
    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    ownerId: string;
}
