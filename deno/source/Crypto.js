import {createHash} from "https://deno.land/std@0.77.0/hash/mod.ts";
import randomBytes from "https://deno.land/std@0.78.0/node/_crypto/randomBytes.ts"

const encoding = "utf8";

export default class {
  static hash(data, algorithm = "sha256", digest = "base64") {
    return createHash(algorithm).update(data, encoding).digest(digest);
  }

  static random(length) {
    return randomBytes(length);
  }
}
