import {Test} from '@nestjs/testing';
import {ProductEntity} from "../../product.entity";
import {ProductRepository} from "../../Repositories/product.repository";
import {DeleteProductService} from "../../Services/delete-product.service";

const repositoryMock = () => ({
    delete: jest.fn(),
});

describe('DeleteProductService', () => {
    let service: DeleteProductService, repository: ProductRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {provide: ProductRepository, useFactory: repositoryMock},
            ],
        }).compile();

        repository = await module.get(ProductRepository);
        service = new DeleteProductService(repository);
    });

    describe('delete', () => {
        const product = new ProductEntity();
        product.id = 'id';

        it('uses product repository to delete given product', async () => {
            await service.delete(product);

            expect(repository.delete).toHaveBeenCalledWith({id: product.id});
        });
    });
});
