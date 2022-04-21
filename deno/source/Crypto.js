import randomBytes from "https://deno.land/std@0.135.0/node/_crypto/randomBytes.ts"

export default class {
  static random(length) {
    return randomBytes(length);
  }
}
