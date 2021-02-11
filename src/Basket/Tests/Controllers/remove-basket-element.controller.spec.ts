import {Test} from '@nestjs/testing';
import {ForbiddenException, NotFoundException} from "@nestjs/common";
import {UserService} from "../../../User/Services/user.service";
import {AddBasketElementDTO} from "../../DTO/add-basket-element.dto";
import {ProductEntity} from "../../../Product/product.entity";
import {UserEntity} from "../../../User/user.entity";
import {BasketElementEntity} from "../../basket-element.entity";
import {RemoveBasketElementService} from "../../Services/remove-basket-element.service";
import {RemoveBasketElementController} from "../../Controllers/remove-basket-element.controller";
import {BasketElementRepository} from "../../Repositories/basket-element.repository";

const removeBasketElementServiceMock = () => ({
    remove: jest.fn(),
});

const userServiceMock = () => ({
    getById: jest.fn(),
});

const basketRepositoryMock = () => ({
    getById: jest.fn(),
});

describe('RemoveBasketElementController', () => {
    let removeBasketElementService: RemoveBasketElementService,
        controller: RemoveBasketElementController,
        userService: UserService,
        basketRepository: BasketElementRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {provide: RemoveBasketElementService, useFactory: removeBasketElementServiceMock},
                {provide: UserService, useFactory: userServiceMock},
                {provide: BasketElementRepository, useFactory: basketRepositoryMock},
            ],
        }).compile();

        removeBasketElementService = await module.resolve(RemoveBasketElementService);
        userService = await module.resolve(UserService);
        basketRepository = await module.get(BasketElementRepository);
        controller = new RemoveBasketElementController(basketRepository, removeBasketElementService, userService);
    });

    describe('remove', () => {
        const basketElement = new BasketElementEntity();

        const dto = new AddBasketElementDTO();
        dto.productId = 'product_id';
        dto.price = '1.1';
        dto.quantity = 10;

        const product = new ProductEntity();
        product.price = '12.0';

        const user = new UserEntity();
        user.id = 'user_id';

        it('throws exception if basket element not exist', async () => {
            jest.spyOn(basketRepository, 'getById').mockResolvedValue(null);

            await expect(controller.remove(user, 'id', 'element_id')).rejects.toThrow(NotFoundException);

            expect(basketRepository.getById).toHaveBeenCalledWith('element_id');
        });

        it('throws exception if basket owner not exist', async () => {
            jest.spyOn(basketRepository, 'getById').mockResolvedValue(basketElement);
            jest.spyOn(userService, 'getById').mockResolvedValue(null);

            await expect(controller.remove(user, 'id', 'element_id')).rejects.toThrow(ForbiddenException);

            expect(userService.getById).toHaveBeenCalledWith('id');
        });

        it('throws exception if logged user is not basket owner', async () => {
            const owner = new UserEntity();
            owner.id = 'other_id';

            jest.spyOn(basketRepository, 'getById').mockResolvedValue(basketElement);
            jest.spyOn(userService, 'getById').mockResolvedValue(owner);

            await expect(controller.remove(user, 'id', 'element_id')).rejects.toThrow(ForbiddenException);
        });

        it('uses remove basket element service to remove element', async () => {
            jest.spyOn(basketRepository, 'getById').mockResolvedValue(basketElement);
            jest.spyOn(userService, 'getById').mockResolvedValue(user);

            await controller.remove(user, 'id', 'element_id');

            expect(removeBasketElementService.remove).toHaveBeenCalledWith(basketElement);
        });

        it('returns removed element', async () => {
            jest.spyOn(basketRepository, 'getById').mockResolvedValue(basketElement);
            jest.spyOn(userService, 'getById').mockResolvedValue(user);

            const result = await controller.remove(user, 'id', 'element_id');

            expect(result).toEqual(basketElement);
        });
    });
});
