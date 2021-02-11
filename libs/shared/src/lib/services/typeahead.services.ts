import { HttpException, Injectable } from '@nestjs/common';
import { env } from 'process';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

/**
 * A tiny JavaScript debugging utility modelled after Node.js core's
 * debugging technique. Works in Node.js and web browsers.
 *
 * [debug](https://www.npmjs.com/package/debug)
 */
import _debug from 'debug';

// Custom interfaces
import { UserModel } from '../models';

// Custom persistent virtual storage
import {
  PersistentVirtualStorageAbstract,
  PersistentVirtualStorageInterface,
} from '@la-manicurista/persistent-virtual-storage';

// Custom helpers
import { PrefixTreeHelper } from '../helpers/prefix-tree.helper';

// Custom constants
import { APLICATION_DEBUG_NAME } from '../constants';

const SUGGESTION_NUMBER: number = Number(env.SUGGESTION_NUMBER);
const debug: any = _debug(
  `${APLICATION_DEBUG_NAME}:services:typeahead.services`
);

@Injectable()
export class TypeaheadService extends PersistentVirtualStorageAbstract {
  #prefixTreeHelper: PrefixTreeHelper;

  /**
   * ¡PROVISIONALLY!
   *
   * Persistent popular users avoiding rebuilding on every call
   */
  #popularUsers: UserModel[];

  constructor() {
    super();
    this._run();
  }

  private _run(): void {
    this.#prefixTreeHelper = new PrefixTreeHelper(Object.keys(this.data));
    this._popularUsers();
  }

  private _userNames(): string[] {
    return Object.keys(this.data);
  }

  private _sortTimes(
    userPrevius: UserModel,
    userCurrent: UserModel,
    prefix?: string
  ): number {
    prefix = prefix?.toLowerCase();

    // Exact prefix always in first position
    if ([userCurrent.name.toLowerCase()].includes(prefix)) return 0;

    if (userCurrent.times > userPrevius.times) return 1;
    else if (userCurrent.times < userPrevius.times) return -1;

    return 0;
  }

  private _popularUsers(): void {
    const users: PersistentVirtualStorageInterface = this.data;

    this.#popularUsers = this._userNames()
      .map(
        (name: string) =>
          new UserModel({
            name: name,
            times: users[name],
          })
      )
      .sort((userPrevius: UserModel, userCurrent: UserModel) =>
        this._sortTimes(userPrevius, userCurrent)
      )
      .splice(0, SUGGESTION_NUMBER);

    debug('_popularUsers()', '#popularUsers', this.#popularUsers);
  }

  private _users(prefix: string): UserModel[] {
    const users: PersistentVirtualStorageInterface = this.data;
    const words: string[] = this.#prefixTreeHelper.find(prefix);
    let usersFound: UserModel[];

    usersFound = this._userNames()
      .filter((userName: string) => words.includes(userName.toLowerCase()))
      .map(
        (word: string) =>
          new UserModel({
            name: word,
            times: users[word] || 0,
          })
      )
      .sort((userPrevius: UserModel, userCurrent: UserModel) =>
        this._sortTimes(userPrevius, userCurrent, prefix)
      )
      .splice(0, SUGGESTION_NUMBER);

    debug('_users()', 'usersFound', usersFound);

    return usersFound;
  }

  list(prefix?: string): Observable<UserModel[]> {
    debug('list()', 'prefix', prefix);

    return of(prefix).pipe(
      map((prefix: string) =>
        prefix ? this._users(prefix) : this.#popularUsers
      )
    );
  }

  update(user: UserModel): Observable<UserModel> {
    let data: PersistentVirtualStorageInterface = this.data;

    return of(user).pipe(
      map((user: UserModel) => {
        let userFound: UserModel;

        if (this.data[user.name])
          userFound = new UserModel({
            name: user.name,
            times: ++this.data[user.name],
          });

        debug('update()', 'map', 'userFound', userFound);
        return userFound;
      }),
      map((userFound: UserModel) => {
        if (!userFound) {
          for (const userName in data) data[userName] = ++data[userName];
        } else data[userFound.name] = userFound.times;

        this.data = data;

        return userFound;
      }),
      tap(() => this._popularUsers()),
      map((userFound: UserModel) => {
        if (!userFound)
          throw new HttpException(`Not found user name '${user.name}'`, 400);

        return userFound;
      })
    );
  }
}
