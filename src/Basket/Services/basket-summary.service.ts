import {Injectable} from "@nestjs/common";
import {BasketElementEntity} from "../basket-element.entity";
import {BasketSummaryDTO} from "../DTO/basket-summary.dto";
import {UserEntity} from "../../User/user.entity";

@Injectable()
export class BasketSummaryService {
    public async summarize(basketElements: Array<BasketElementEntity>, owner: UserEntity, showElements: boolean = true): Promise<BasketSummaryDTO> {
        const dto = new BasketSummaryDTO();

        dto.owner = owner;
        dto.id = owner.id;

        if (showElements) {
            dto.elements = basketElements;
        }

        dto.countOfElements = basketElements.length;
        dto.totalPrice =  basketElements.reduce((total: string, element: BasketElementEntity) => {
            return (String)(parseFloat(total) + parseFloat(element.price) * element.quantity);
        }, '0');

        return dto;
    }
}