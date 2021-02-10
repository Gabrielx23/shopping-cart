import {Test} from '@nestjs/testing';
import {ProductDTO} from "../../DTO/product.dto";
import {NotFoundException} from "@nestjs/common";
import {ProductEntity} from "../../product.entity";
import {ProductRepository} from "../../Repositories/product.repository";
import {ProductImageService} from "../../Services/product-image.service";
import {UpdateProductController} from "../../Controllers/update-product.controller";
import {UpdateProductService} from "../../Services/update-product.service";

const updateProductServiceMock = () => ({
    update: jest.fn(),
});

const repositoryMock = () => ({
    findOne: jest.fn(),
});

const productImageServiceMock = () => ({
    removeImage: jest.fn(),
});

describe('UpdateProductController', () => {
    let updateProductService: UpdateProductService,
        controller: UpdateProductController,
        repository: ProductRepository,
        productImageService: ProductImageService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {provide: UpdateProductService, useFactory: updateProductServiceMock},
                {provide: ProductRepository, useFactory: repositoryMock},
                {provide: ProductImageService, useFactory: productImageServiceMock},
            ],
        }).compile();

        updateProductService = await module.resolve(UpdateProductService);
        productImageService = await module.resolve(ProductImageService);
        repository = await module.get(ProductRepository);
        controller = new UpdateProductController(repository, updateProductService, productImageService);
    });

    describe('update', () => {
        const dto = new ProductDTO();
        dto.name = 'product';
        dto.price = '1.1';

        const image = {path: '/some/path'};

        it('throws exception if product by id not exist', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);

            await expect(controller.update('id', image, dto)).rejects.toThrow(NotFoundException);
            expect(repository.findOne).toHaveBeenCalledWith({id: 'id'});
        });

        it('removes old image file and stores new path if image exist', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(new ProductEntity());

            await controller.update('id', image, dto);

            dto.image = image.path;

            expect(productImageService.removeImage).toHaveBeenCalledWith(new ProductEntity());
            expect(updateProductService.update).toHaveBeenCalledWith(new ProductEntity(), dto);
        });

        it('returns updated product', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(new ProductEntity());

            const result = await controller.update('id', undefined, dto);

            expect(result).toEqual(new ProductEntity());
        });
    });
});
