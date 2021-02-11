import {Injectable} from "@nestjs/common";
import {BasketElementRepository} from "../Repositories/basket-element.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {BasketElementEntity} from "../basket-element.entity";
import {UserEntity} from "../../User/user.entity";
import {ProductEntity} from "../../Product/product.entity";

@Injectable()
export class AddBasketElementService {
    constructor(
        @InjectRepository(BasketElementRepository)
        private readonly basketElements: BasketElementRepository,
    ) {}

    public async add(partial: Partial<BasketElementEntity>, owner: UserEntity, product: ProductEntity): Promise<BasketElementEntity> {
        const basketElement = this.basketElements.create(partial);

        basketElement.owner = owner;
        basketElement.product = product;

        return await this.basketElements.save(basketElement);
    }
}