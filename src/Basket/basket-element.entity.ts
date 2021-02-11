import {
    BaseEntity, Column,
    CreateDateColumn,
    Entity, ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {BasketElementInterface} from "./basket-element.interface";
import {UserInterface} from "../User/user.interface";
import {ProductInterface} from "../Product/product.interface";

@Entity('basket_elements')
export class BasketElementEntity extends BaseEntity implements BasketElementInterface{
    @ApiProperty({example: '91e56daf-04ef-4bbc-abe7-5d3a8ee41101'})
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne('UserEntity', 'baskets')
    owner: UserInterface;

    @ManyToOne('ProductEntity', 'baskets')
    product: ProductInterface;

    @ApiProperty({example: '12.99'})
    @Column('text')
    price: string;

    @ApiProperty({example: 5})
    @Column('integer')
    quantity: number;

    @ApiProperty({example: '2020-08-10T05:59:36.708Z'})
    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    createdAt: Date;

    @ApiProperty({example: '2020-08-10T05:59:36.708Z'})
    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    updatedAt: Date;
}
