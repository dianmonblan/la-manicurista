/**
 * Allows use of decorator and non-decorator based validation. Internally
 * uses validator.js to perform validation. Class-validator works on both
 * browser and node.js platforms.
 * [class-validator](https://github.com/typestack/class-validator)
 */
import {
  IsAlpha,
  IsInt,
  IsPositive,
  Length,
  Max,
  ValidateIf,
} from 'class-validator';

// Custom models
import { AbstractModel } from './abstract-model.model';

interface UserInterface {
  name: string;
  times: number;
}

export enum USER_SCENARIOS {
  PREFIX = 'prefix',
}

export class UserModel
  extends AbstractModel<UserModel>
  implements UserInterface {
  @IsAlpha()
  @Length(1, 100)
  name: string;

  @ValidateIf(
    (user: UserModel) =>
      ![USER_SCENARIOS.PREFIX.toString()].includes(user.scenario)
  )
  @IsInt()
  @IsPositive()
  @Max(1_000_000)
  times: number;
}
