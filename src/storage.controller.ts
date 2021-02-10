import {ApiNotFoundResponse, ApiOkResponse, ApiTags} from "@nestjs/swagger";
import {Controller, Get, Param, Res} from "@nestjs/common";

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
    @Get(':directory/:file')
    @ApiOkResponse()
    @ApiNotFoundResponse()
    public get(
        @Param('directory') directory: string,
        @Param('file') file: string,
        @Res() res
    ) {
        return res.sendFile(file, {root: `./storage/${directory}`});
    }
}