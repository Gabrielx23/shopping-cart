import {Test} from '@nestjs/testing';
import {ProductEntity} from "../../product.entity";
import {ProductRepository} from "../../Repositories/product.repository";
import {ProductService} from "../../Services/product.service";

const repositoryMock = () => ({
    findOne: jest.fn(),
});

describe('ProductService', () => {
    let service: ProductService, repository: ProductRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {provide: ProductRepository, useFactory: repositoryMock},
            ],
        }).compile();

        repository = await module.get(ProductRepository);
        service = new ProductService(repository);
    });

    describe('getById', () => {
        const product = new ProductEntity();

        it('uses product repository to obtain product by id', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(product);

            const result = await service.getById('id');

            expect(repository.findOne).toBeCalledWith({id: 'id'});
            expect(result).toEqual(product);
        });
    });
});
