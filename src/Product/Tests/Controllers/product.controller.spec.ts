import {Test} from '@nestjs/testing';
import {ProductEntity} from "../../product.entity";
import {ProductRepository} from "../../Repositories/product.repository";
import {ProductController} from "../../Controllers/product.controller";
import {Pagination} from "nestjs-typeorm-paginate";
import {NotFoundException} from "@nestjs/common";

const repositoryMock = () => ({
    findOne: jest.fn(),
    paginate: jest.fn(),
});

describe('ProductController', () => {
    let repository: ProductRepository, controller: ProductController;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {provide: ProductRepository, useFactory: repositoryMock},
            ],
        }).compile();

        repository = await module.get(ProductRepository);
        controller = new ProductController(repository);
    });

    describe('getAll', () => {
        const pagination = new Pagination(
            [new ProductEntity()],
            { currentPage: 0, itemCount: 0, itemsPerPage: 0, totalItems: 0, totalPages: 0 },
            {},
        );

        it('returns paginated product list', async () => {
            jest.spyOn(repository, 'paginate').mockResolvedValue(pagination);

            const result = await controller.getAll(2, 3);

            expect(result).toEqual(pagination);
            expect(repository.paginate).toHaveBeenCalledWith({page: 2, limit: 3});
        });
    });

    describe('getById', () => {
        it('throws exception if product not exist', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);

            await expect(controller.getById('id')).rejects.toThrow(NotFoundException);
            expect(repository.findOne).toHaveBeenCalledWith({id: 'id'});
        });

        it('returns product if product exists', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(new ProductEntity());

            const result = await controller.getById('id');

            expect(result).toEqual(new ProductEntity());
        });
    });
});
