import {ApiBadRequestResponse, ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiTags} from "@nestjs/swagger";
import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {AuthGuard} from "../../User/auth.guard";
import {ProductEntity} from "../product.entity";
import {ProductDTO} from "../DTO/product.dto";
import {CreateProductService} from "../Services/create-product.service";
import {ApiImplicitFile} from "@nestjs/swagger/dist/decorators/api-implicit-file.decorator";
import {FileInterceptor} from "@nestjs/platform-express";
import {productImagesConfig} from "../product-images.config";
import {ProductException} from "../product.exception";

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Product')
@Controller('products')
export class CreateProductController {
    constructor(
        private readonly createProductService: CreateProductService
    ) {}

    @Post()
    @UseInterceptors(FileInterceptor('image', productImagesConfig))
    @UsePipes(ValidationPipe)
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({name: 'image', required: true})
    @ApiCreatedResponse()
    @ApiBadRequestResponse()
    public async create(@UploadedFile() image, @Body() productDTO: ProductDTO): Promise<ProductEntity> {
        if (!image) {
            throw ProductException.productImageIsRequired();
        }

        productDTO.image = image.path;

        return await this.createProductService.create(productDTO);
    }
}