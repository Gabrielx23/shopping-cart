import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiNotFoundResponse, ApiOkResponse,
    ApiTags
} from "@nestjs/swagger";
import {
    ClassSerializerInterceptor,
    Controller, Get,
    UseGuards, UseInterceptors,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {AuthGuard} from "../../User/auth.guard";
import {InjectRepository} from "@nestjs/typeorm";
import {BasketElementRepository} from "../Repositories/basket-element.repository";
import {UserService} from "../../User/Services/user.service";
import {BasketSummaryService} from "../Services/basket-summary.service";
import {BasketSummaryDTO} from "../DTO/basket-summary.dto";

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Basket')
@Controller('basket')
export class BasketsListController {
    constructor(
        @InjectRepository(BasketElementRepository)
        private readonly basketElements: BasketElementRepository,
        private readonly basketSummaryService: BasketSummaryService,
        private readonly userService: UserService,
    ) {}

    @Get()
    @UsePipes(ValidationPipe)
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiOkResponse({type: [BasketSummaryDTO]})
    @ApiBadRequestResponse()
    @ApiNotFoundResponse()
    public async list() {
        const owners = await this.userService.getAll();

        const baskets = [];

        for (const owner of owners) {
            const elements = await this.basketElements.getBasketElements(owner.id);
            const basketSummary = await this.basketSummaryService.summarize(elements, owner, false);
            baskets.push(basketSummary);
        }

        return baskets;
    }
}