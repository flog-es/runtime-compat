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

const ResponseWrapper = class {
  constructor(response) {
    this.response = response;
    this.status = 200;
  }

  setHeader(key, value) {
    this.response.setHeader(key, value);
  }

  setStatus(status) {
    this.status = status;
  }

  setBody(body) {
    this.body = body;
  }

  end() {
    this.response.writeHead(this.status);
    this.response.end(this.body);
  }
};

export default class {
  constructor(conf, handler) {
    this.handler = (request, response) =>
      handler(new RequestWrapper(request), new ResponseWrapper(response));
    this.server = createServer(conf, this.handler);
  }

  listen(port, host) {
    this.server.listen(port, host);
  }
}
