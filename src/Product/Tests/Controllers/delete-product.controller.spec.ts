import {Test} from '@nestjs/testing';
import {ProductDTO} from "../../DTO/product.dto";
import {NotFoundException} from "@nestjs/common";
import {ProductEntity} from "../../product.entity";
import {DeleteProductService} from "../../Services/delete-product.service";
import {DeleteProductController} from "../../Controllers/delete-product.controller";
import {ProductRepository} from "../../Repositories/product.repository";
import {ProductImageService} from "../../Services/product-image.service";

const deleteProductServiceMock = () => ({
    delete: jest.fn(),
});

const repositoryMock = () => ({
    findOne: jest.fn(),
});

const productImageServiceMock = () => ({
    removeImage: jest.fn(),
});

describe('DeleteProductController', () => {
    let deleteProductService: DeleteProductService,
        controller: DeleteProductController,
        repository: ProductRepository,
        productImageService: ProductImageService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {provide: DeleteProductService, useFactory: deleteProductServiceMock},
                {provide: ProductRepository, useFactory: repositoryMock},
                {provide: ProductImageService, useFactory: productImageServiceMock},
            ],
        }).compile();

        deleteProductService = await module.resolve(DeleteProductService);
        productImageService = await module.resolve(ProductImageService);
        repository = await module.get(ProductRepository);
        controller = new DeleteProductController(repository, deleteProductService, productImageService);
    });

    describe('create', () => {
        const dto = new ProductDTO();
        dto.name = 'product';
        dto.price = '1.1';

        const image = {path: '/some/path'};

        it('throws exception if product by id not exist', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);

            await expect(controller.delete('id')).rejects.toThrow(NotFoundException);
            expect(repository.findOne).toHaveBeenCalledWith({id: 'id'});
        });

        it('uses delete service to delete product', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(new ProductEntity());

            await controller.delete('id');

            expect(deleteProductService.delete).toHaveBeenCalledWith(new ProductEntity());
        });

        it('uses product image service to delete current product image', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(new ProductEntity());

            await controller.delete('id');

            expect(productImageService.removeImage).toHaveBeenCalledWith(new ProductEntity());
        });

        it('returns deleted product', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(new ProductEntity());

            const result = await controller.delete('id');

            expect(result).toEqual(new ProductEntity());
        });
    });
});
