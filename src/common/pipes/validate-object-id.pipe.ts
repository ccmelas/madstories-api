import { Injectable, PipeTransform, ArgumentMetadata, NotFoundException } from "@nestjs/common";
import { Types } from 'mongoose';

@Injectable()
export class ValidateObjectIdPipe implements PipeTransform<string, string> {
    transform(value: string, metadata: ArgumentMetadata) {
        if (!Types.ObjectId.isValid(value)) {
            throw new NotFoundException('Not found');
        }
        return value;
    }
}