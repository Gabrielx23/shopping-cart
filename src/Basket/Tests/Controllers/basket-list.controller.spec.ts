import {Test} from '@nestjs/testing';
import {UserService} from "../../../User/Services/user.service";
import {UserEntity} from "../../../User/user.entity";
import {BasketElementEntity} from "../../basket-element.entity";
import {BasketSummaryService} from "../../Services/basket-summary.service";
import {BasketElementRepository} from "../../Repositories/basket-element.repository";
import {BasketSummaryDTO} from "../../DTO/basket-summary.dto";
import {BasketsListController} from "../../Controllers/baskets-list.controller";

const basketSummaryServiceMock = () => ({
    summarize: jest.fn(),
});

const basketRepositoryMock = () => ({
    getBasketElements: jest.fn(),
});

const userServiceMock = () => ({
    getAll: jest.fn(),
});

describe('BasketListController', () => {
    let basketSummaryService: BasketSummaryService,
        controller: BasketsListController,
        userService: UserService,
        basketRepository: BasketElementRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {provide: BasketSummaryService, useFactory: basketSummaryServiceMock},
                {provide: UserService, useFactory: userServiceMock},
                {provide: BasketElementRepository, useFactory: basketRepositoryMock},
            ],
        }).compile();

        basketSummaryService = await module.resolve(BasketSummaryService);
        userService = await module.resolve(UserService);
        basketRepository = await module.get(BasketElementRepository);
        controller = new BasketsListController(basketRepository, basketSummaryService, userService);
    });

    describe('list', () => {
        const basketElement = new BasketElementEntity();

        const user = new UserEntity();
        user.id = 'user_id';

        const summary = new BasketSummaryDTO();
        summary.owner = user;
        summary.elements = [basketElement];
        summary.countOfElements = 1;
        summary.totalPrice = '11';

        it('uses user service to obtain all owners', async () => {
            jest.spyOn(userService, 'getAll').mockResolvedValue([user]);

            await controller.list();

            expect(userService.getAll).toHaveBeenCalled();
        });

        it('uses basket repository to obtain all basket elements', async () => {
            jest.spyOn(userService, 'getAll').mockResolvedValue([user]);
            jest.spyOn(basketRepository, 'getBasketElements').mockResolvedValue([basketElement]);

            await controller.list();

            expect(basketRepository.getBasketElements).toHaveBeenCalled();
        });

        it('uses basket summary service to calculate basket summary', async () => {
            jest.spyOn(userService, 'getAll').mockResolvedValue([user]);
            jest.spyOn(basketRepository, 'getBasketElements').mockResolvedValue([basketElement]);
            jest.spyOn(basketSummaryService, 'summarize').mockResolvedValue(summary);

            await controller.list();

            expect(basketSummaryService.summarize).toHaveBeenCalledWith([basketElement], user, false);
        });

        it('returns summarized baskets', async () => {
            jest.spyOn(userService, 'getAll').mockResolvedValue([user]);
            jest.spyOn(basketRepository, 'getBasketElements').mockResolvedValue([basketElement]);
            jest.spyOn(basketSummaryService, 'summarize').mockResolvedValue(summary);

            const result = await controller.list();

            expect(result).toEqual([summary]);
        });
    });
});
