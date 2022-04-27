import {join, resolve, dirname} from "path";

const file_prefix = 7;

export default class {
  constructor(path = "") {
    this.path = path.startsWith("file://") ? path.slice(file_prefix) : path;
  }

  get directory() {
    return dirname(this.path);
  }

  static join(...paths) {
    return join(...paths);
  }

  static dirname(path) {
    return dirname(path);
  }

  static resolve(...paths) {
    return resolve(...paths);
  }
}
