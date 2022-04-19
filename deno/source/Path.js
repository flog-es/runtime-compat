import {join, resolve, dirname} from "https://deno.land/std@0.135.0/path/mod.ts";

const file_prefix = 7;

export default class {
  constructor(path = "") {
    this.path = path.startsWith("file://") ? path.slice(file_prefix) : path;
  }

  static join(...args)  {
    return join(...args);
  }

  static dirname(...args) {
    return dirname(...args);
  }

  static resolve(...args) {
    return resolve(...args);
  }
}
