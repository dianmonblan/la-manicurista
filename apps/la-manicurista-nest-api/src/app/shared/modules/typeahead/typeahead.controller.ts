import { Logger, UsePipes } from '@nestjs/common';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Observable } from 'rxjs';

// Custom shared
import {
  API_RESOURCES_PREFIX,
  PrefixPipe,
  TypeaheadService,
  UserModel,
  UserPipe,
  USER_SCENARIOS,
} from '@la-manicurista/shared';

const DEBUG_NAME: string = `shared:modules:typeahead:typeahead.controller`;

@Controller(API_RESOURCES_PREFIX.TYPEAHEAD)
export class TypeaheadController {
  constructor(private readonly _typeaheadService: TypeaheadService) {}

  @Get()
  list(): Observable<UserModel[]> {
    Logger.log('list()', DEBUG_NAME, true);
    return this._typeaheadService.list();
  }

  @Get(':prefix')
  listPrefix(
    @Param('prefix', new PrefixPipe()) prefix?: string
  ): Observable<UserModel[]> {
    Logger.log(`list():prefix'${prefix}'`, DEBUG_NAME, true);
    return this._typeaheadService.list(prefix);
  }

  @Post()
  @UsePipes(new UserPipe(USER_SCENARIOS.PREFIX))
  update(@Body() userBody: UserModel): Observable<UserModel> {
    Logger.log(
      `update():userBody'${JSON.stringify(userBody)}'`,
      DEBUG_NAME,
      true
    );
    return this._typeaheadService.update(userBody);
  }
}
