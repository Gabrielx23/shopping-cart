import {Test} from '@nestjs/testing';
import {ProductDTO} from "../../DTO/product.dto";
import {ProductEntity} from "../../product.entity";
import {ProductRepository} from "../../Repositories/product.repository";
import {UpdateProductService} from "../../Services/update-product.service";

const repositoryMock = () => ({
    save: jest.fn(),
});

describe('UpdateProductService', () => {
    let service: UpdateProductService, repository: ProductRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {provide: ProductRepository, useFactory: repositoryMock},
            ],
        }).compile();

        repository = await module.get(ProductRepository);
        service = new UpdateProductService(repository);
    });

    describe('update', () => {
        const dto = new ProductDTO();
        dto.price = '2.2';

        const product = new ProductEntity();
        product.price = '1.1';

        it('uses product repository to save updated product', async () => {
            await service.update(product, dto);

            expect(repository.save).toHaveBeenCalledWith({...product, ...dto});
        });

        it('replaces commas to dots in price before save', async () => {
            dto.price = '2,1';

            await service.update(product, dto);

            dto.price = '2.1';

            expect(repository.save).toHaveBeenCalledWith({...product, ...dto});
        });
    });
});
