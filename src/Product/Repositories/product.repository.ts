import { Repository, EntityRepository } from 'typeorm';
import {ProductEntity} from "../product.entity";
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";

@EntityRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
    public async paginate(options: IPaginationOptions): Promise<Pagination<ProductEntity>> {
        const query = this.createQueryBuilder('products');

        query.orderBy('products.createdAt', 'DESC');

        return paginate<ProductEntity>(query, options);
    }
}
