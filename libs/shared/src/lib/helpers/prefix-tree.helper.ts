/**
 * A prefix tree is also known as a Trie; it is used to
 * optimize the search complexities.
 *
 * [Prefix Tree](https://www.educative.io/edpresso/what-is-a-prefix-tree)
 */

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
  `${APLICATION_DEBUG_NAME}:shared:helpers:prefix-tree.helper`
);

export class PrefixTrieNodeHelper {
  public parent = null;
  public children = {};
  public isLast = false;

  constructor(public key: string) {}

  public toString(): string {
    let word: string[] = [];
    let node: PrefixTrieNodeHelper = this;

    while (node) {
      word.push(node.key);
      node = node.parent;
    }

    return word.reverse().join('');
  }
}

export class PrefixTreeHelper {
  public root: PrefixTrieNodeHelper = new PrefixTrieNodeHelper(null);

  constructor(words?: string | string[]) {
    debug('constructor()');
    this._run(words);
  }

  private _run(words?: string | string[]): void {
    if (words) {
      debug('_run()', 'words', words);
      this.insert(words);
    }
  }

  private _insert(word: string) {
    let node: PrefixTrieNodeHelper = this.root;

    for (let index: number = 0; index < word.length; index++) {
      const prefix: string = word[index]?.toLowerCase();

      if (!node.children[prefix]) {
        node.children[prefix] = new PrefixTrieNodeHelper(prefix);
        node.children[prefix].parent = node;
      }

      node = node.children[prefix];

      if (index == word.length - 1) node.isLast = true;
    }
  }

  public insert(words: string | string[]): void {
    // Convert word to word array for general handling
    if (!Array.isArray(words)) words = [words];

    words.sort().forEach((word: string) => this._insert(word));
  }

  private _findAllWords(node: PrefixTrieNodeHelper, words: string[]): void {
    if (node.isLast) words.push(node.toString());

    for (let child in node.children)
      this._findAllWords(node.children[child], words);
  }

  public find(prefix: string): string[] {
    let words: string[] = [];
    let node: PrefixTrieNodeHelper = this.root;
    prefix = prefix?.toLowerCase();

    for (let index: number = 0; index < prefix.length; index++) {
      if (node.children[prefix[index]]) node = node.children[prefix[index]];
      else return words;
    }

    this._findAllWords(node, words);

    debug('find()', 'words', words);

    return words;
  }
}
