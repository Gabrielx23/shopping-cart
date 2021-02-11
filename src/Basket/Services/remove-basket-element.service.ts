import {Injectable} from "@nestjs/common";
import {BasketElementRepository} from "../Repositories/basket-element.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {BasketElementEntity} from "../basket-element.entity";

@Injectable()
export class RemoveBasketElementService {
    constructor(
        @InjectRepository(BasketElementRepository)
        private readonly basketElements: BasketElementRepository,
    ) {}

    public async remove(basketElement: BasketElementEntity): Promise<void> {
        await this.basketElements.delete({id: basketElement.id});
    }
}