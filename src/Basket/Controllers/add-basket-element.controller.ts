import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiTags
} from "@nestjs/swagger";
import {
    Body, ClassSerializerInterceptor,
    Controller, Param, ParseUUIDPipe,
    Post,
    UseGuards, UseInterceptors,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {AuthGuard} from "../../User/auth.guard";
import {AddBasketElementService} from "../Services/add-basket-element.service";
import {AddBasketElementDTO} from "../DTO/add-basket-element.dto";
import {BasketElementEntity} from "../basket-element.entity";
import {ProductService} from "../../Product/Services/product.service";
import {UserService} from "../../User/Services/user.service";
import {ProductException} from "../../Product/product.exception";
import {UserException} from "../../User/Exceptions/user.exception";

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Basket')
@Controller('basket')
export class AddBasketElementController {
    constructor(
        private readonly addBasketElementService: AddBasketElementService,
        private readonly productService: ProductService,
        private readonly userService: UserService,
    ) {}

    @Post(':ownerId')
    @UsePipes(ValidationPipe)
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiCreatedResponse({type: BasketElementEntity})
    @ApiBadRequestResponse()
    @ApiNotFoundResponse()
    public async add(
        @Param('ownerId', new ParseUUIDPipe()) ownerId: string,
        @Body() addBasketElementDTO: AddBasketElementDTO
    ): Promise<BasketElementEntity> {
        const product = await this.productService.getById(addBasketElementDTO.productId);

        if (!product) {
            throw ProductException.productNotExist();
        }

        const owner = await this.userService.getById(ownerId);

        if (!owner) {
            throw UserException.userNotExist();
        }

        if (!addBasketElementDTO.price) {
            addBasketElementDTO.price = product.price;
        }

        return await this.addBasketElementService.add(addBasketElementDTO, owner, product);
    }
}