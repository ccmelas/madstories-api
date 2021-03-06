import { PipeTransform, ArgumentMetadata, HttpException, HttpStatus } from "@nestjs/common";
import { plainToClass } from 'class-transformer';
import { validate } from "class-validator";

export class ValidatorPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const object = plainToClass(metatype, value);
        const errors = await validate(object);

        if (errors.length > 0)
            throw new HttpException({ message: "Validation Failed", errors }, HttpStatus.UNPROCESSABLE_ENTITY);
        
        return value;
    }

    private toValidate(metatype): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find(type => metatype === type);
    }
}