'use strict';

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const { resolve, sep } = require('node:path');
const fs = require('node:fs');
const vm = require('node:vm');

class Sanitizer {
  #throwSanitize = false;
  #purifier = createDOMPurify(new JSDOM('').window);
  #options = null;

  constructor({ throwSanitize = false, options } = {}) {
    this.#throwSanitize = throwSanitize;
    this.#options = options ?? Sanitizer.#DEFAULT_OPTIONS;
  }

  sanitize(input) {
    const output = {};
    const options = this.#options;
    for (const name of Object.keys(input)) {
      const dirty = input[name];
      if (typeof dirty !== "string") {
        output[name] = dirty;
      } else {
        const clean = this.#purifier.sanitize(dirty, options);
        if (this.#throwSanitize && clean.length < dirty.length) {
          throw new Error(`HTML Injection, input: ${dirty}`);
        }
        output[name] = clean;
      }
    }
    return output;
  }

  static #DEFAULT_OPTIONS = { ALLOWED_TAGS: [], ALLOWED_ATTR: [], };
}

class Realm {
  static #EXECUTION_TIMEOUT = 5000;

  static #EMPTY_CONTEXT = vm.createContext(Object.freeze({}), {
    codeGeneration: {
      strings: false,
      wasm: false,
    },
  });

  create(source) {
    return new vm.Script("'use strict';\n(props) => (`" + source + "`);")
      .runInNewContext(
        Realm.#EMPTY_CONTEXT,
        { timeout: Realm.#EXECUTION_TIMEOUT }
      );
  }
}

class FrameWork {
  #collection = new Map();
  #sanitizer = null;
  #realm = null;

  constructor(options) {
    this.#sanitizer = new Sanitizer(options);
    this.#realm = new Realm();
  }

  load(paths) {
    for (const path of paths) {
      const key = path.split(sep).at(-1);
      const { script, styles = "" } = this.#loadDir(path);
      this.#collection.set(key, (props) => script({ ...props, styles, }));
    }
    return this;
  }

  letter(name, options) {
    const letter = this.#collection.get(name);
    if (letter === undefined) return;
    if (typeof options !== "object" || options === null) {
      throw new Error("Letter parameters have to an object");
    }
    return letter(this.#sanitizer.sanitize(options));
  }

  #loadDir(dir) {
    const dataset = {
      'index.html': undefined,
      'styles.css': undefined
    };
    for (const file of fs.readdirSync(dir)) {
      if (!Object.hasOwn(dataset, file)) continue;
      dataset[file] = fs.readFileSync(resolve(dir, file), "utf-8");
    }
    if (!dataset["index.html"]) {
      throw new Error("Can't find index.html file");
    }
    return {
      script: this.#realm.create(dataset['index.html']),
      styles: dataset["styles.css"],
    }
  }
}

module.exports = FrameWork;
