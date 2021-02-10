import {Test} from '@nestjs/testing';
import {CreateProductService} from "../../Services/create-product.service";
import {ProductDTO} from "../../DTO/product.dto";
import {ProductEntity} from "../../product.entity";
import {ProductRepository} from "../../Repositories/product.repository";

const repositoryMock = () => ({
    create: jest.fn(),
    save: jest.fn(),
});

describe('CreateProductService', () => {
    let service: CreateProductService, repository: ProductRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {provide: ProductRepository, useFactory: repositoryMock},
            ],
        }).compile();

        repository = await module.get(ProductRepository);
        service = new CreateProductService(repository);
    });

    describe('create', () => {
        const dto = new ProductDTO();

        const product = new ProductEntity();
        product.price = '1.1';

        it('uses product repository to create and save product', async () => {
            jest.spyOn(repository, 'create').mockReturnValue(product);

            await service.create(dto);

            expect(repository.create).toBeCalledWith(dto);
            expect(repository.save).toHaveBeenCalledWith(product);
        });

        it('replaces commas to dots in price before save', async () => {
            product.price = '1,1';

            jest.spyOn(repository, 'create').mockReturnValue(product);

            await service.create(dto);

            product.price = '1.1';

            expect(repository.save).toHaveBeenCalledWith(product);
        });

        it('returns created product', async () => {
            jest.spyOn(repository, 'create').mockReturnValue(product);

            const result = await service.create(dto);

            expect(result).toEqual(product);
        });
    });
});
