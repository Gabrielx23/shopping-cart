import {ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags} from "@nestjs/swagger";
import {
    Controller, Delete, Param, ParseUUIDPipe,
    UseGuards,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {AuthGuard} from "../../User/auth.guard";
import {ProductEntity} from "../product.entity";
import {DeleteProductService} from "../Services/delete-product.service";
import {ProductImageService} from "../Services/product-image.service";
import {InjectRepository} from "@nestjs/typeorm";
import {ProductRepository} from "../Repositories/product.repository";
import {ProductException} from "../product.exception";

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Product')
@Controller('products')
export class DeleteProductController {
    constructor(
        @InjectRepository(ProductRepository)
        private readonly products: ProductRepository,
        private readonly deleteProductService: DeleteProductService,
        private readonly productImageService: ProductImageService,
    ) {}

    @Delete(':id')
    @UsePipes(ValidationPipe)
    @ApiOkResponse({type: ProductEntity})
    @ApiBadRequestResponse()
    @ApiNotFoundResponse()
    public async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<ProductEntity> {
        const product = await this.products.findOne({id})

        if (!product) {
            throw ProductException.productNotExist();
        }

        await this.deleteProductService.delete(product);
        await this.productImageService.removeImage(product);

        return product;
    }
}