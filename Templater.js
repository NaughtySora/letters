'use strict';

// const createDOMPurify = require('dompurify');
// const { JSDOM } = require('jsdom');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const loader = (dir) => {
  const dataset = { 'index.html': null, 'styles.css': null };
  const folder = fs.readdirSync(dir);
  for (const file of folder) {
    if (!Object.hasOwn(dataset, file)) continue;
    dataset[file] = fs.readFileSync(path.resolve(dir, file), "utf-8");
  }
  return {
    html: dataset['index.html'],
    css: dataset["styles.css"],
  };
};

const { css, html } = loader("./reset-password");

const EXECUTION_TIMEOUT = 5000;

const EMPTY_CONTEXT = vm.createContext(Object.freeze({}), {
  codeGeneration: {
    strings: false,
    wasm: false,
  },
});

const wrapSource = src => "'use strict';\n(props) => (`" + src + "`);";

const createModule = source =>
  new vm.Script(wrapSource(source)).
    runInNewContext(EMPTY_CONTEXT, { timeout: EXECUTION_TIMEOUT });

const fn = createModule(html);

console.log(fn({ name: "<script>test</script>", style: css }));

// const window = new JSDOM('').window;
// const DOMPurify = createDOMPurify(window);
// const input = `<b>Hello</b> <script>alert('XSS')</script>`;
// const input_good = "Hello <3";

// idea is if input after sanitization has less length it means it was stripped so -> log it, security breach attempt
// const clean = (input) =>
//   DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [], });

// console.log({ input, clean: clean(input).trim() });
// console.log({ input_good, clean: clean(input_good).trim(), });