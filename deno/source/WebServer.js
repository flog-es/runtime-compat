import {serveTls} from "https://deno.land/std/http/server.ts";
import {readAll} from "https://deno.land/std@0.103.0/io/util.ts";

const RequestWrapper = class {
  constructor(request) {
    this.request = request;
  }

  get body() {
    return this.request.body !== null
      ? readAll(this.request.body).then(body => new TextDecoder().decode(body))
      : "";
  }

  get headers() {
    return this.request.headers;
  }

  get method() {
    return this.request.method;
  }
}

const ResponseWrapper = class {
  constructor() {
    this.options = {
      "headers": {},
      "status": 200,
    };
  }

  setHeader(key, value) {
    this.options.headers[key] = value;
  }

  setStatus(status) {
    this.options.status = status;
  }

  setBody(body) {
    this.body = body;
  }

  send() {
    return new Response(this.body, this.options);
  }

  end() {
    // no-op
  }
}

export default class {
  constructor(conf, handler) {
    this.conf = conf;
    this.handler = request => {
      const response = new ResponseWrapper();
      return handler(new RequestWrapper(request), response).then(() => 
        response.send()
      )
    };
  }

  listen(port, host) {
    serveTls(this.handler, ({...this.conf, port, host}));
  }
}
