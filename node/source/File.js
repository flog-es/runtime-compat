import {join} from "path";
import fs from "fs";

const options = {"encoding": "utf8"};

const readdir = path => new Promise((resolve, reject) =>
  fs.readdir(path, options,
    (error, files) => error === null ? resolve(files) : reject(error)
  ));

export default class File {
  constructor(...args) {
    this.path = join(...args);
  }

  get stats() {
    return new Promise(resolve =>
      fs.lstat(this.path, (error, stats) => resolve(stats)));
  }

  get modified() {
    return this.stats.then(({mtimeMs}) => Math.round(mtimeMs));
  }

  get exists() {
    return this.stats.then(() => true, () => false);
  }

  get is_file() {
    return this.stats.then(stats => stats?.isFile());
  }

  get is_directory() {
    return this.stats.then(stats => stats?.isDirectory());
  }

  get stream() {
    return this.read_stream;
  }

  get read_stream() {
    return fs.createReadStream(this.path, {"flags": "r"});
  }

  get write_stream() {
    return fs.createWriteStream(this.path);
  }

  remove() {
    return new Promise((resolve, reject) => fs.rm(this.path,
      {"recursive": true, "force": true},
      error => error === null ? resolve(this) : reject(error)
    ));
  }

  create() {
    return new Promise((resolve, reject) => fs.mkdir(this.path, error =>
      error === null ? resolve(this) : reject(error)
    ));
  }

  async copy(to) {
    if (await this.is_directory) {
      // copy all files
      return Promise.all((await this.list()).map(file =>
        new File(`${this.path}/${file}`).copy(`${to}/${file}`)
      ));
    } else {
      return new Promise((resolve, reject) => fs.copyFile(this.path, to,
        error => error === null ? resolve(this) : reject(error)));
    }
  }

  list() {
    return readdir(this.path);
  }

  static list(...args) {
    return new File(...args).list();
  }

  read(options = {"encoding": "utf8"}) {
    return new Promise((resolve, reject) =>
      fs.readFile(this.path, options, (error, nonerror) =>
        error === null ? resolve(nonerror) : reject(error)));
  }

  write(data, options = {"encoding": "utf8"}) {
    return new Promise((resolve, reject) => fs.writeFile(this.path, data,
      options,
      error => error === null ? resolve(this) : reject(error)));
  }

  static read_sync(path, options = {"encoding": "utf8"}) {
    return fs.readFileSync(path, options);
  }

  static exists(...args) {
    return new File(...args).exists;
  }

  static read(...args) {
    return new File(...args).read();
  }

  static write(path, data, options) {
    return new File(path).write(data, options);
  }

  static remove(...args) {
    return new File(...args).remove();
  }

  static create(...args) {
    return new File(...args).create();
  }

  static copy(from, to) {
    return new File(from).copy(to);
  }
}
