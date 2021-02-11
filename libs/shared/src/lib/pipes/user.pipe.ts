import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';

/**
 * Class-transformer allows you to transform plain object to some instance
 * of class and versa. Also it allows to serialize / deserialize object
 * based on criteria. This tool is super useful on both frontend and backend.
 * [class-transformer](https://github.com/typestack/class-transformer#classtoplain)
 */
import { plainToClass } from 'class-transformer';

/**
 * Allows use of decorator and non-decorator based validation. Internally
 * uses validator.js to perform validation. Class-validator works on both
 * browser and node.js platforms.
 * [class-validator](https://github.com/typestack/class-validator)
 */
import { validate, ValidationError } from 'class-validator';

// Custom models
import { UserModel } from '../models/user.model';

@Injectable()
export class UserPipe implements PipeTransform<UserModel> {
  constructor(private _scenario?: string) {}

  public async transform(
    userData: UserModel,
    { metatype }: ArgumentMetadata
  ): Promise<UserModel> {
    if (!metatype || !this.toValidate(metatype)) return userData;

    let user: UserModel = new UserModel(userData);
    user.scenario = this._scenario;

    const object: Record<string, any>[] = plainToClass(metatype, user);
    const errors: ValidationError[] = (await validate(object))?.map(
      (error: ValidationError) =>
        <ValidationError>{
          property: error.property,
          constraints: error.constraints,
        }
    );

    if (errors.length) throw new BadRequestException(errors);

    return user;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
