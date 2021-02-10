import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {Exclude} from "class-transformer";
import {Matches} from "class-validator";

@Entity('products')
export class ProductEntity extends BaseEntity {
    @ApiProperty({example: '91e56daf-04ef-4bbc-abe7-5d3a8ee41101'})
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({example: 'Product 1'})
    @Column('text')
    name: string;

    @ApiProperty({example: 'john.doe@hotmail.com'})
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
