import {ApiProperty} from '@nestjs/swagger';
import {UserEntity} from "../../User/user.entity";
import {BasketElementEntity} from "../basket-element.entity";

export class BasketSummaryDTO {
    @ApiProperty({example: '91e56daf-04ef-4bbc-abe7-5d3a8ee41101'})
    id: string;

    @ApiProperty({type: UserEntity})
    owner: UserEntity;

    @ApiProperty({type: [BasketElementEntity]})
    elements?: BasketElementEntity[];

    @ApiProperty({example: 5})
    countOfElements: number;

    @ApiProperty({example: '122.11'})
    totalPrice: string;
}
