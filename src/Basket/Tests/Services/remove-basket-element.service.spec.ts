import {Test} from '@nestjs/testing';
import {BasketElementRepository} from "../../Repositories/basket-element.repository";
import {BasketElementEntity} from "../../basket-element.entity";
import {RemoveBasketElementService} from "../../Services/remove-basket-element.service";

const repositoryMock = () => ({
    delete: jest.fn(),
});

describe('RemoveBasketElementService', () => {
    let service: RemoveBasketElementService, repository: BasketElementRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {provide: BasketElementRepository, useFactory: repositoryMock},
            ],
        }).compile();

        repository = await module.get(BasketElementRepository);
        service = new RemoveBasketElementService(repository);
    });

    describe('remove', () => {
        const element = new BasketElementEntity();
        element.id = 'id';

        it('uses basket element repository to remove element', async () => {
            await service.remove(element);

            expect(repository.delete).toBeCalledWith({id: element.id});
        });
    });
});
