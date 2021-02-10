import {Injectable} from "@nestjs/common";
import {ProductRepository} from "../Repositories/product.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {ProductEntity} from "../product.entity";

@Injectable()
export class DeleteProductService {
    constructor(
        @InjectRepository(ProductRepository)
        private readonly products: ProductRepository
    ) {}

    public async delete(product: ProductEntity): Promise<void> {
        await this.products.delete({id: product.id});
    }
}