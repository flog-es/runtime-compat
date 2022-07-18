import {createServer} from "https";

const RequestWrapper = class {
  constructor(request) {
    this.request = request;
  }

  async text() {
    const buffers = [];
    for await (const chunk of this.request) {
      buffers.push(chunk);
    }
    return Buffer.concat(buffers).toString();
  }

  get headers() {
    return this.request.headers;
  }

  get method() {
    return this.request.method;
  }

  get url() {
    return new URL(`https://1${this.request.url}`);
  }
};

export default class {
  constructor(conf, handler) {
    this.server = createServer(conf, handler);
  }

  listen(port, host) {
    this.server.listen(port, host);
  }
}
