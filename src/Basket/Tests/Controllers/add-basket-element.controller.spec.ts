import {Test} from '@nestjs/testing';
import {NotFoundException} from "@nestjs/common";
import {AddBasketElementService} from "../../Services/add-basket-element.service";
import {AddBasketElementController} from "../../Controllers/add-basket-element.controller";
import {UserService} from "../../../User/Services/user.service";
import {ProductService} from "../../../Product/Services/product.service";
import {AddBasketElementDTO} from "../../DTO/add-basket-element.dto";
import {ProductEntity} from "../../../Product/product.entity";
import {UserEntity} from "../../../User/user.entity";
import {BasketElementEntity} from "../../basket-element.entity";

const addBasketElementServiceMock = () => ({
    add: jest.fn(),
});

const productServiceMock = () => ({
    getById: jest.fn(),
});

const userServiceMock = () => ({
    getById: jest.fn(),
});

describe('AddBasketElementController', () => {
    let addBasketElementService: AddBasketElementService,
        controller: AddBasketElementController,
        userService: UserService,
        productService: ProductService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {provide: AddBasketElementService, useFactory: addBasketElementServiceMock},
                {provide: UserService, useFactory: userServiceMock},
                {provide: ProductService, useFactory: productServiceMock},
            ],
        }).compile();

        addBasketElementService = await module.resolve(AddBasketElementService);
        userService = await module.resolve(UserService);
        productService = await module.resolve(ProductService);
        controller = new AddBasketElementController(addBasketElementService, productService, userService);
    });

    describe('add', () => {
        const basketElement = new BasketElementEntity();

        const dto = new AddBasketElementDTO();
        dto.productId = 'product_id';
        dto.price = '1.1';
        dto.quantity = 10;

        const product = new ProductEntity();
        product.price = '12.0';

        const user = new UserEntity();
        user.id = 'user_id';

        it('throws exception if selected product by id not exist', async () => {
            jest.spyOn(productService, 'getById').mockResolvedValue(null);

            await expect(controller.add(user.id, dto)).rejects.toThrow(NotFoundException);
            expect(productService.getById).toHaveBeenCalledWith(dto.productId);
        });

        it('throws exception if basket owner not exist', async () => {
            jest.spyOn(productService, 'getById').mockResolvedValue(product);
            jest.spyOn(userService, 'getById').mockResolvedValue(null);

            await expect(controller.add(user.id, dto)).rejects.toThrow(NotFoundException);
            expect(userService.getById).toHaveBeenCalledWith(user.id);
        });

        it('sets product price if price not exist', async () => {
            jest.spyOn(productService, 'getById').mockResolvedValue(product);
            jest.spyOn(userService, 'getById').mockResolvedValue(user);

            dto.price = undefined;

            await controller.add(user.id, dto);

            dto.price = product.price;

            expect(addBasketElementService.add).toHaveBeenCalledWith(dto, user, product);
        });

        it('returns added element', async () => {
            jest.spyOn(productService, 'getById').mockResolvedValue(product);
            jest.spyOn(userService, 'getById').mockResolvedValue(user);
            jest.spyOn(addBasketElementService, 'add').mockResolvedValue(basketElement);

            const result = await controller.add(user.id, dto);

            expect(result).toEqual(basketElement);
        });
    });
});
