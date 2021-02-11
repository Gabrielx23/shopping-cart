import {Test} from '@nestjs/testing';
import {NotFoundException} from "@nestjs/common";
import {UserService} from "../../../User/Services/user.service";
import {UserEntity} from "../../../User/user.entity";
import {BasketElementEntity} from "../../basket-element.entity";
import {BasketSummaryService} from "../../Services/basket-summary.service";
import {BasketSummaryController} from "../../Controllers/basket-summary.controller";
import {BasketElementRepository} from "../../Repositories/basket-element.repository";
import {BasketSummaryDTO} from "../../DTO/basket-summary.dto";

const basketSummaryServiceMock = () => ({
    summarize: jest.fn(),
});

const basketRepositoryMock = () => ({
    getBasketElements: jest.fn(),
});

const userServiceMock = () => ({
    getById: jest.fn(),
});

describe('BasketSummaryController', () => {
    let basketSummaryService: BasketSummaryService,
        controller: BasketSummaryController,
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
        controller = new BasketSummaryController(basketRepository, basketSummaryService, userService);
    });

    describe('summary', () => {
        const basketElement = new BasketElementEntity();

        const user = new UserEntity();
        user.id = 'user_id';

        const summary = new BasketSummaryDTO();
        summary.owner = user;
        summary.elements = [basketElement];
        summary.countOfElements = 1;
        summary.totalPrice = '11';

        it('throws exception if basket owner not exist', async () => {
            jest.spyOn(userService, 'getById').mockResolvedValue(null);

            await expect(controller.summary(user.id)).rejects.toThrow(NotFoundException);
            expect(userService.getById).toHaveBeenCalledWith(user.id);
        });

        it('uses basket element repository to obtain all basket elements', async () => {
            jest.spyOn(userService, 'getById').mockResolvedValue(user);
            jest.spyOn(basketRepository, 'getBasketElements').mockResolvedValue([basketElement]);

            await controller.summary(user.id);

            expect(basketRepository.getBasketElements).toHaveBeenCalledWith(user.id);
        });

        it('uses basket summary service to calculate basket summary', async () => {
            jest.spyOn(userService, 'getById').mockResolvedValue(user);
            jest.spyOn(basketRepository, 'getBasketElements').mockResolvedValue([basketElement]);

            await controller.summary(user.id);

            expect(basketSummaryService.summarize).toHaveBeenCalledWith([basketElement], user);
        });

        it('returns summarized basket', async () => {
            jest.spyOn(userService, 'getById').mockResolvedValue(user);
            jest.spyOn(basketRepository, 'getBasketElements').mockResolvedValue([basketElement]);
            jest.spyOn(basketSummaryService, 'summarize').mockResolvedValue(summary);

            const result = await controller.summary(user.id);

            expect(result).toEqual(summary);
        });
    });
});
