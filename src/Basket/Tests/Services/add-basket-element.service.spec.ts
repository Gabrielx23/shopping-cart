import {Test} from '@nestjs/testing';
import {AddBasketElementService} from "../../Services/add-basket-element.service";
import {BasketElementRepository} from "../../Repositories/basket-element.repository";
import {ProductEntity} from "../../../Product/product.entity";
import {UserEntity} from "../../../User/user.entity";
import {AddBasketElementDTO} from "../../DTO/add-basket-element.dto";
import {BasketElementEntity} from "../../basket-element.entity";

const repositoryMock = () => ({
    create: jest.fn(),
    save: jest.fn(),
});

describe('AddBasketElementService', () => {
    let service: AddBasketElementService, repository: BasketElementRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {provide: BasketElementRepository, useFactory: repositoryMock},
            ],
        }).compile();

        repository = await module.get(BasketElementRepository);
        service = new AddBasketElementService(repository);
    });

    describe('add', () => {
        const dto = new AddBasketElementDTO();
        dto.price = '11.1';
        dto.quantity = 5;

        const owner = new UserEntity();

        const product = new ProductEntity();
        product.price = '1.1';

        const element = new BasketElementEntity();

        it('uses basket element repository to create element', async () => {
            jest.spyOn(repository, 'create').mockReturnValue(element);

            await service.add(dto, owner, product);

            expect(repository.create).toBeCalledWith(dto);
        });

        it('sets product and owner before element save', async () => {
            jest.spyOn(repository, 'create').mockReturnValue(element);

            await service.add(dto, owner, product);

            element.product = product;
            element.owner = owner;

            expect(repository.save).toBeCalledWith(element);
        });

        it('returns created element', async () => {
            jest.spyOn(repository, 'create').mockReturnValue(element);
            jest.spyOn(repository, 'save').mockResolvedValue(element);

            const result = await service.add(dto, owner, product);

            expect(result).toEqual(element);
        });
    });
});
