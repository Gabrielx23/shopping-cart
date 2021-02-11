import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {Exclude} from "class-transformer";
import {UserInterface} from "./user.interface";
import {BasketElementInterface} from "../Basket/basket-element.interface";

@Entity('users')
@Unique(['email'])
export class UserEntity extends BaseEntity implements UserInterface {
    @ApiProperty({example: '91e56daf-04ef-4bbc-abe7-5d3a8ee41101'})
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany('BasketElementEntity', 'owner')
    basketElements: BasketElementInterface[];

    @ApiProperty({example: 'John Doe'})
    @Column('text')
    name: string;

    @ApiProperty({example: 'john.doe@hotmail.com'})
    @Column('text')
    email: string;

    @ApiProperty({example: 'Demo2020'})
    @Column('text')
    @Exclude({toPlainOnly: true})
    password: string;

    @Column({nullable: true})
    @Exclude({toPlainOnly: true})
    token: string;

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
