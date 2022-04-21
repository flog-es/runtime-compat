import {randomBytes} from "crypto";

export default class {
  static random(length) {
    return randomBytes(length);
  }
}
