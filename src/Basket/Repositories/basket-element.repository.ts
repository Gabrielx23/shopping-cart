import { Repository, EntityRepository } from 'typeorm';
import {BasketElementEntity} from "../basket-element.entity";

@EntityRepository(BasketElementEntity)
export class BasketElementRepository extends Repository<BasketElementEntity> {
    public async getById(id: string): Promise<BasketElementEntity> {
        const query = this.createQueryBuilder('basket_elements');

        return query.where('basket_elements.id = :id', {id})
            .leftJoinAndSelect('basket_elements.product', 'product')
            .getOne();
    }

    public async getBasketElements(ownerId: string): Promise<Array<BasketElementEntity>> {
        const query = this.createQueryBuilder('basket_elements');

        return query.where('basket_elements.ownerId = :ownerId', {ownerId})
            .leftJoinAndSelect('basket_elements.product', 'product')
            .orderBy('basket_elements.createdAt', 'DESC')
            .getMany();
    }
}
