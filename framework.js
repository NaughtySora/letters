'use strict';

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const fs = require('node:fs');
const { resolve } = require('node:path');
const vm = require('node:vm');

// idea is if input after sanitization has less length it means it was stripped so -> log it, security breach attempt

class FrameWork {
  #collection = new Map();
  #throwSanitize = false;

  constructor({ throwSanitize = false } = {}) {
    this.#throwSanitize = throwSanitize;
  }

  load(paths) {
    for (const path of paths) {
      const key = path.split("\\").at(-1);
      const { script, styles } = this.#loadDir(path);
      this.#collection.set(key, (props) => script({ ...props, styles, }));
    }
  }

  letter(name, props) {
    const letter = this.#collection.get(name);
    if (letter === undefined) return;
    if (typeof props !== "object" || props === null) {
      throw new Error("Letter parameters have to an object");
    }
    return letter(this.#sanitize(props));
  }

  #loadDir(dir) {
    const dataset = { 'index.html': null, 'styles.css': null };
    for (const file of fs.readdirSync(dir)) {
      if (!Object.hasOwn(dataset, file)) continue;
      dataset[file] = fs.readFileSync(resolve(dir, file), "utf-8");
    }
    if (dataset["index.html"] === null || dataset["styles.css"] === null) {
      throw new Error("Lack of info to create script for letters template");
    }
    return {
      script: this.#createModule(dataset['index.html']),
      styles: dataset["styles.css"],
    }
  }

  #createModule(source) {
    return new vm.Script("'use strict';\n(props) => (`" + source + "`);")
      .runInNewContext(
        FrameWork.#EMPTY_CONTEXT,
        { timeout: FrameWork.#EXECUTION_TIMEOUT }
      );
  }

  #sanitize(input) {
    const output = {};
    for (const name of Object.keys(input)) {
      const dirty = input[name];
      if (typeof dirty !== "string") continue;
      const clean = FrameWork.#sanitizer.sanitize(
        dirty,
        { ALLOWED_TAGS: [], ALLOWED_ATTR: [], },
      );
      if (this.#throwSanitize && clean.length < dirty.length) {
        throw new Error(`HTML Injection, input: ${dirty}`);
      }
      output[name] = clean;
    }
    return output;
  }

  static #EXECUTION_TIMEOUT = 5000;

  static #EMPTY_CONTEXT = vm.createContext(Object.freeze({}), {
    codeGeneration: {
      strings: false,
      wasm: false,
    },
  });

  static #sanitizer = createDOMPurify(new JSDOM('').window);
}

const framework = new FrameWork({ throwSanitize: true });
framework.load([resolve(__dirname, "./reset-password"),]);
const letter = framework.letter("reset-password", { name: "123456" });
console.log(letter);