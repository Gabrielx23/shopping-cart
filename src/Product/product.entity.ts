import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {Exclude} from "class-transformer";
import {ProductInterface} from "./product.interface";
import {BasketElementInterface} from "../Basket/basket-element.interface";

@Entity('products')
export class ProductEntity extends BaseEntity implements ProductInterface{
    @ApiProperty({example: '91e56daf-04ef-4bbc-abe7-5d3a8ee41101'})
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany('BasketElementEntity', 'product')
    basketElements: BasketElementInterface[];

    @ApiProperty({example: 'Product 1'})
    @Column('text')
    name: string;

    @ApiProperty({example: '12.99'})
    @Column('text')
    price: string;

    @ApiProperty({example: 'http://localhost:3000/products/91e56daf-04ef-4bbc-abe7-5d3a8ee41101/image'})
    @Column('text')
    @Exclude()
    image: string;

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
