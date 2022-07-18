import {createHash, randomBytes} from "crypto";

const SHA256 = "sha256";
const UTF8 = "utf8";
const BASE64 = "base64";

export default class {
  static random(length) {
    return randomBytes(length);
  }
}

export const hash = (payload, options = {}) => {
  const {algorithm = SHA256, encoding = UTF8, digest = BASE64} = options;
  return createHash(algorithm).update(payload, encoding).digest(digest);
};

export {SHA256};
