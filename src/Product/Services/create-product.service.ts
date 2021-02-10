import {Injectable} from "@nestjs/common";
import {ProductRepository} from "../Repositories/product.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {ProductEntity} from "../product.entity";

@Injectable()
export class CreateProductService {
    constructor(
        @InjectRepository(ProductRepository)
        private readonly products: ProductRepository
    ) {}

    public async create(partial: Partial<ProductEntity>): Promise<ProductEntity> {
        const product = this.products.create(partial);

        product.price = product.price.replace(',', '.');

        await this.products.save(product);

        return product;
    }
}