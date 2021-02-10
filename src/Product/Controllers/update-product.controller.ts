import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConsumes, ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags
} from "@nestjs/swagger";
import {
    Body,
    Controller, Param, ParseUUIDPipe,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {AuthGuard} from "../../User/auth.guard";
import {ProductEntity} from "../product.entity";
import {ProductDTO} from "../DTO/product.dto";
import {ApiImplicitFile} from "@nestjs/swagger/dist/decorators/api-implicit-file.decorator";
import {FileInterceptor} from "@nestjs/platform-express";
import {productImagesConfig} from "../product-images.config";
import {ProductRepository} from "../Repositories/product.repository";
import {UpdateProductService} from "../Services/update-product.service";
import {ProductImageService} from "../Services/product-image.service";
import {InjectRepository} from "@nestjs/typeorm";
import {ProductException} from "../product.exception";

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Product')
@Controller('products')
export class UpdateProductController {
    constructor(
        @InjectRepository(ProductRepository)
        private readonly products: ProductRepository,
        private readonly updateProductService: UpdateProductService,
        private readonly productImageService: ProductImageService,
    ) {}

    @Put(':id')
    @UseInterceptors(FileInterceptor('image', productImagesConfig))
    @UsePipes(ValidationPipe)
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({name: 'image', required: true})
    @ApiOkResponse({type: ProductEntity})
    @ApiBadRequestResponse()
    @ApiNotFoundResponse()
    public async update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @UploadedFile() image,
        @Body() productDTO: ProductDTO,
    ): Promise<ProductEntity> {
        const product = await this.products.findOne({id});

        if (!product) {
            throw ProductException.productNotExist();
        }

        if (image) {
            await this.productImageService.removeImage(product);
            productDTO.image = image.path;
        }

        await this.updateProductService.update(product, productDTO);

        return await this.products.findOne({id})
    }
}