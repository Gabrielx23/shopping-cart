import {ApiNotFoundResponse, ApiOkResponse, ApiTags} from "@nestjs/swagger";
import {Controller, Get, NotFoundException, Param, Res} from "@nestjs/common";
import * as fs from 'fs';

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
        const path = `./storage/${directory}/${file}`;

        if (fs.existsSync(path)) {
            return res.sendFile(file, {root: `./storage/${directory}`});
        }

        throw new NotFoundException();
    }
}