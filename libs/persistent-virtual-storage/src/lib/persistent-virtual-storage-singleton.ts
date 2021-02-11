import { readFileSync } from 'fs';
import { env } from 'process';

/**
 * A tiny JavaScript debugging utility modelled after Node.js core's
 * debugging technique. Works in Node.js and web browsers.
 *
 * [debug](https://www.npmjs.com/package/debug)
 */
import _debug from 'debug';

/**
 * Custom shared
 *
 * Note: The path `@la-manicurista/shared` is not called to avoid circulars
 */
import { APLICATION_DEBUG_NAME } from 'libs/shared/src/lib/constants';

const debug: any = _debug(
  `${APLICATION_DEBUG_NAME}:persistent-virtual-storage:persistent-virtual-storage-singleton`
);

export interface PersistentVirtualStorageInterface {
  [name: string]: number;
}

class PersistentVirtualStorage {
  #data: PersistentVirtualStorageInterface;

  set data(data: PersistentVirtualStorageInterface) {
    this.#data = data;
  }
  get data(): PersistentVirtualStorageInterface {
    return this.#data;
  }

  constructor(dataFilePath: string) {
    debug('constructor()');
    this._run(dataFilePath);
  }

  private _run(dataFilePath: string): void {
    /**
     * ¡PROVISIONALLY!
     *
     * Recommendation: Work in independent thread NON-LOCKING mode.
     */
    this.#data = JSON.parse(readFileSync(`${dataFilePath}`, 'utf8'));

    debug('_run()', '#data', this.#data);
  }
}

/**
 * Application of the singleton design pattern to ensure a single global
 * instance of persistent data in the application.
 */
export abstract class PersistentVirtualStorageSingleton {
  private static _instance: PersistentVirtualStorage;

  public static connect(dataFilePath: string): PersistentVirtualStorage {
    if (!this._instance)
      this._instance = new PersistentVirtualStorage(dataFilePath);

    return this._instance;
  }
}

export abstract class PersistentVirtualStorageAbstract {
  set data(data: PersistentVirtualStorageInterface) {
    PersistentVirtualStorageSingleton.connect(env.DATA_FILE_PATH).data = data;
  }

  get data(): PersistentVirtualStorageInterface {
    return PersistentVirtualStorageSingleton.connect(env.DATA_FILE_PATH).data;
  }
}
