import nacl from "tweetnacl";
import { randomBytes } from "crypto";

export function generateKey() {
  return nacl.randomBytes(32);
}

export function encryptData(data, key) {
  const nonce = nacl.randomBytes(24);
  const messageUint8 = new TextEncoder().encode(JSON.stringify(data));

  const encrypted = nacl.secretbox(messageUint8, nonce, key);

  return {
    nonce: Array.from(nonce),
    data: Array.from(encrypted),
  };
}

export function decryptData(encrypted, key) {
  const nonce = new Uint8Array(encrypted.nonce);
  const data = new Uint8Array(encrypted.data);

  const decrypted = nacl.secretbox.open(data, nonce, key);

  return JSON.parse(new TextDecoder().decode(decrypted));
}