import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiNotFoundResponse, ApiOkResponse,
    ApiTags
} from "@nestjs/swagger";
import {
    ClassSerializerInterceptor,
    Controller, Get, Param, ParseUUIDPipe,
    UseGuards, UseInterceptors,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {AuthGuard} from "../../User/auth.guard";
import {InjectRepository} from "@nestjs/typeorm";
import {BasketElementRepository} from "../Repositories/basket-element.repository";
import {UserService} from "../../User/Services/user.service";
import {UserException} from "../../User/Exceptions/user.exception";
import {BasketSummaryService} from "../Services/basket-summary.service";
import {BasketSummaryDTO} from "../DTO/basket-summary.dto";

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Basket')
@Controller('basket')
export class BasketSummaryController {
    constructor(
        @InjectRepository(BasketElementRepository)
        private readonly basketElements: BasketElementRepository,
        private readonly basketSummaryService: BasketSummaryService,
        private readonly userService: UserService,
    ) {}

    @Get(':ownerId')
    @UsePipes(ValidationPipe)
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiOkResponse({type: BasketSummaryDTO})
    @ApiBadRequestResponse()
    @ApiNotFoundResponse()
    public async summary(
        @Param('ownerId', new ParseUUIDPipe()) ownerId: string,
    ): Promise<BasketSummaryDTO> {
        const owner = await this.userService.getById(ownerId);

        if (!owner) {
            throw UserException.userNotExist();
        }

        const basketElements = await this.basketElements.getBasketElements(ownerId);

        return await this.basketSummaryService.summarize(basketElements, owner);
    }
}