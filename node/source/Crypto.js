import {createHash, randomBytes} from "crypto";

const encoding = "utf8";

export default class {
  static hash(data, algorithm = "sha256", digest = "base64") {
    return createHash(algorithm).update(data, encoding).digest(digest);
  }

  static random(length) {
    return randomBytes(length);
  }
}
