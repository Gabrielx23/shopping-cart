import {Test} from '@nestjs/testing';
import {CreateProductService} from "../../Services/create-product.service";
import {CreateProductController} from "../../Controllers/create-product.controller";
import {ProductDTO} from "../../DTO/product.dto";
import {BadRequestException} from "@nestjs/common";
import {ProductEntity} from "../../product.entity";

const createProductServiceMock = () => ({
    create: jest.fn(),
});

describe('CreateProductController', () => {
    let service: CreateProductService, controller: CreateProductController;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {provide: CreateProductService, useFactory: createProductServiceMock},
            ],
        }).compile();

        service = await module.resolve(CreateProductService);
        controller = new CreateProductController(service);
    });

    describe('create', () => {
        const dto = new ProductDTO();
        dto.name = 'product';
        dto.price = '1.1';

        const image = {path: '/some/path'};

        it('throws exception if image not exist', async () => {
            await expect(controller.create(undefined, dto)).rejects.toThrow(BadRequestException);
        });

        it('changes product image path and uses create service to create product', async () => {
            await controller.create(image, dto);

            dto.image = image.path;

            expect(service.create).toHaveBeenCalledWith(dto);
        });

        it('returns created product', async () => {
            jest.spyOn(service, 'create').mockResolvedValue(new ProductEntity());

            const result = await controller.create(image, dto);

            expect(result).toEqual(new ProductEntity());
        });
    });
});
