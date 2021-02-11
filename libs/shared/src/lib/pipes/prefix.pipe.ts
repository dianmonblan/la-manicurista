import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

/**
 * Allows use of decorator and non-decorator based validation. Internally
 * uses validator.js to perform validation. Class-validator works on both
 * browser and node.js platforms.
 * [class-validator](https://github.com/typestack/class-validator)
 */
import { isAlpha, length } from 'class-validator';

@Injectable()
export class PrefixPipe implements PipeTransform<string> {
  public transform(prefix: string): string {
    if ([isAlpha(prefix), length(prefix, 1, 100)].includes(false))
      throw new BadRequestException(`Prefix '${prefix}' validation failed`);

    return prefix;
  }
}
