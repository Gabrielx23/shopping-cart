import {Injectable} from "@nestjs/common";
import {ProductEntity} from "../product.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {ProductRepository} from "../Repositories/product.repository";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductRepository)
        private readonly products: ProductRepository
    ) {}

    public async getById(id: string): Promise<ProductEntity | null> {
        return await this.products.findOne({id});
    }
}