import { encryptData } from "../../crypto/encryption";

let userKey = null;

export function initKey() {
  userKey = crypto.getRandomValues(new Uint8Array(32));
}

export function encryptPortfolio(data) {
  return encryptData(data, userKey);
}