import {Test} from '@nestjs/testing';
import {ProductEntity} from "../../../Product/product.entity";
import {UserEntity} from "../../../User/user.entity";
import {BasketElementEntity} from "../../basket-element.entity";
import {BasketSummaryService} from "../../Services/basket-summary.service";
import {BasketSummaryDTO} from "../../DTO/basket-summary.dto";

describe('BasketSummaryService', () => {
    let service: BasketSummaryService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [],
        }).compile();

        service = new BasketSummaryService();
    });

    describe('summarize', () => {
        const owner = new UserEntity();
        owner.id = 'user_id';

        const product = new ProductEntity();

        const element = new BasketElementEntity();
        element.price = '10.00';
        element.quantity = 5;
        element.product = product;

        const summary = new BasketSummaryDTO();
        summary.id = owner.id;
        summary.owner = owner;
        summary.elements = [element];
        summary.countOfElements = 1;
        summary.totalPrice = '50';

        it('properly calculates basket summary', async () => {
            const result = await service.summarize([element], owner);

            expect(result).toEqual(summary);
        });

        it('returns summary without elements if show elements flag is set as false', async () => {
            const result = await service.summarize([element], owner, false);

            summary.elements = undefined;

            expect(result).toEqual(summary);
        });
    });
});
