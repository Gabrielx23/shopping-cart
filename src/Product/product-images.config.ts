import {randomStringGenerator} from "@nestjs/common/utils/random-string-generator.util";
import {extname} from "path";
import {BadRequestException} from "@nestjs/common";
import { diskStorage } from  'multer';

export const productImagesConfig = {
    limits: {
        fileSize: parseFloat(process.env.MAX_PRODUCT_IMAGE_SIZE),
    },
    fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            cb(null, true);
        } else {
            cb(new BadRequestException(`Unsupported file type ${extname(file.originalname)}`), false);
        }
    },
    storage: diskStorage({
        destination: './storage/product-images',
        filename: (req, file, cb) => {
            const randomName = randomStringGenerator();
            return cb(null, `${randomName}${extname(file.originalname)}`)
        }
    }),
};