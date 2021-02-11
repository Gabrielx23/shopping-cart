import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiNotFoundResponse, ApiOkResponse,
    ApiTags
} from "@nestjs/swagger";
import {
    ClassSerializerInterceptor,
    Controller, Delete, Param, ParseUUIDPipe,
    UseGuards, UseInterceptors,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {AuthGuard} from "../../User/auth.guard";
import {InjectRepository} from "@nestjs/typeorm";
import {BasketElementRepository} from "../Repositories/basket-element.repository";
import {BasketElementEntity} from "../basket-element.entity";
import {UserService} from "../../User/Services/user.service";
import {ProductException} from "../../Product/product.exception";
import {RemoveBasketElementService} from "../Services/remove-basket-element.service";
import {ProductService} from "../../Product/Services/product.service";
import {BasketException} from "../basket.exception";
import {LoggedUser} from "../../User/logged-user.decorator";
import {UserEntity} from "../../User/user.entity";

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Basket')
@Controller('basket')
export class RemoveBasketElementController {
    constructor(
        @InjectRepository(BasketElementRepository)
        private readonly basketElements: BasketElementRepository,
        private readonly removeBasketElementService: RemoveBasketElementService,
        private readonly productService: ProductService,
        private readonly userService: UserService,
    ) {}

    @Delete(':ownerId/:elementId')
    @UsePipes(ValidationPipe)
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiOkResponse({type: BasketElementEntity})
    @ApiBadRequestResponse()
    @ApiNotFoundResponse()
    public async remove(
        @LoggedUser() user: UserEntity,
        @Param('ownerId', new ParseUUIDPipe()) ownerId: string,
        @Param('elementId', new ParseUUIDPipe()) elementId: string,
    ): Promise<BasketElementEntity> {
        const element = await this.basketElements.getById(elementId);

        if (!element) {
            throw BasketException.basketElementNotExist();
        }

        const product = await this.productService.getById(element.product.id);

        if (!product) {
            throw ProductException.productNotExist();
        }

        const owner = await this.userService.getById(ownerId);

        if (!owner || owner.id !== user.id) {
            throw BasketException.onlyBasketOwnerCanProceedThisAction();
        }

        await this.removeBasketElementService.remove(element);

        return element;
    }
}