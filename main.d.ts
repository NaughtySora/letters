export class Template {
  constructor(options?: { throwSanitize?: boolean })
  load(paths: string[]): this;
  html<O extends object>(name: string, options?: O): string;
}
