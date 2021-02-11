import {CreateProductService} from "./create-product.service";
import {ProductImageService} from "./product-image.service";
import {DeleteProductService} from "./delete-product.service";
import {UpdateProductService} from "./update-product.service";
import {ProductService} from "./product.service";

export const services = [
    CreateProductService,
    ProductImageService,
    DeleteProductService,
    UpdateProductService,
    ProductService,
];