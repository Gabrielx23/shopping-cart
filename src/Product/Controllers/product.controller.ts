import {ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags} from "@nestjs/swagger";
import {
    Controller, Get, Param, ParseUUIDPipe, Query,
} from "@nestjs/common";
import {ProductEntity} from "../product.entity";
import {ProductRepository} from "../Repositories/product.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {ProductException} from "../product.exception";
import {Pagination} from "nestjs-typeorm-paginate";

@ApiTags('Product')
@Controller('products')
export class ProductController {
    constructor(
        @InjectRepository(ProductRepository)
        private readonly products: ProductRepository,
    ) {}

    @Get('/')
    @ApiOkResponse({type: [ProductEntity]})
    @ApiBadRequestResponse()
    public async getAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<Pagination<ProductEntity>> {
        return await this.products.paginate({page, limit});
    }

    @Get(':id')
    @ApiOkResponse({type: ProductEntity})
    @ApiNotFoundResponse()
    public async getById(@Param('id', new ParseUUIDPipe()) id: string): Promise<ProductEntity> {
        const product = await this.products.findOne({id});

        if (!product) {
            throw ProductException.productNotExist();
        }

        return product;
    }
}