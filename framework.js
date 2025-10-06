'use strict';

// const createDOMPurify = require('dompurify');
// const { JSDOM } = require('jsdom');
const fs = require('node:fs');
const { resolve } = require('node:path');
const vm = require('node:vm');

class FrameWork {
  #collection = new Map();

  load(paths) {
    for (const path of paths) {
      const key = path.split("\\").at(-1);
      const { script, styles } = this.#loadDir(path);
      this.#collection.set(key, (props) => script({ ...props, styles, }));
    }
    return this.#collection;
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
        FrameWork.EMPTY_CONTEXT,
        { timeout: FrameWork.EXECUTION_TIMEOUT }
      );
  }

  static EXECUTION_TIMEOUT = 5000;

  static EMPTY_CONTEXT = vm.createContext(Object.freeze({}), {
    codeGeneration: {
      strings: false,
      wasm: false,
    },
  });
}

const framework = new FrameWork();

const data = framework.load([
  resolve(__dirname, "./reset-password"),
]);

console.log(data.get("reset-password")({ name: "Sora" }));

// const window = new JSDOM('').window;
// const DOMPurify = createDOMPurify(window);
// const input = `<b>Hello</b> <script>alert('XSS')</script>`;
// const input_good = "Hello <3";

// idea is if input after sanitization has less length it means it was stripped so -> log it, security breach attempt
// const clean = (input) =>
//   DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [], });

// console.log({ input, clean: clean(input).trim() });
// console.log({ input_good, clean: clean(input_good).trim(), });