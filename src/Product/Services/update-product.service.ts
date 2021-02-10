import {Injectable} from "@nestjs/common";
import {ProductRepository} from "../Repositories/product.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {ProductEntity} from "../product.entity";

@Injectable()
export class UpdateProductService {
    constructor(
        @InjectRepository(ProductRepository)
        private readonly products: ProductRepository
    ) {}

    public async update(product: ProductEntity, partial: Partial<ProductEntity>): Promise<void> {
        partial.price = partial.price.replace(',', '.');

        await this.products.save({...product, ...partial});
    }
}