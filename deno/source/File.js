import {join} from "https://deno.land/std@0.135.0/path/mod.ts";

export default class File {
  constructor(...args) {
    this.path = join(...args);
  }

  get stats() {
    return Deno.lstat(this.path);
  }

  get modified() {
    return this.stats.then(({mtime}) => Math.round(mtime));
  }

  get exists() {
    return this.stats.then(() => true, () => false);
  }

  get is_file() {
    return this.stats.then(({isFile}) => isFile);
  }

  get is_directory() {
    return this.stats.then(({isDirectory}) => isDirectory);
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

  async remove() {
    try {
      await Deno.remove(this.path, {"recursive": true, "force": true});
    } catch (error) {
      // suppress error
    }
  }

  create() {
    return new Promise((resolve, reject) => Deno.mkdir(this.path, error =>
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
      return Deno.copyFile(this.path, to);
    }
  }

  async list() {
    const files = [];
    for await (const {name} of Deno.readDir(this.path)) {
      files.push(name);
    }
    return files;
  }

  static list(...args) {
    return new File(...args).list();
  }

  async read(options = {"encoding": "utf8"}) {
    const decoder = new TextDecoder(options.encoding ?? "utf-8");
    return decoder.decode(await Deno.readFile(this.path));
  }

  write(data, options = {"encoding": "utf8"}) {
    return new Promise((resolve, reject) => Deno.writeFile(this.path, data,
      options,
      error => error === null ? resolve(this) : reject(error)));
  }

  static read_sync(path, options = {"encoding": "utf8"}) {
    return Deno.readFileSync(path, options);
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

  static copy(from, to) {
    return new File(from).copy(to);
  }
}
