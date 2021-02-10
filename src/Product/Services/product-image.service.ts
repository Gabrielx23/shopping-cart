import {Injectable} from "@nestjs/common";
import {ProductEntity} from "../product.entity";
import * as fs from 'fs';

@Injectable()
export class ProductImageService {
    public async removeImage(product: ProductEntity): Promise<void> {
        try {
            fs.unlinkSync(product.image)
        } catch (err) {}
    }
}