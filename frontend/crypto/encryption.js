// Simple encryption using browser

export function generateKey() {
  return crypto.getRandomValues(new Uint8Array(32));
}

export async function encryptData(data, key) {
  const encoded = new TextEncoder().encode(JSON.stringify(data));

  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    key,
    "AES-GCM",
    false,
    ["encrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    encoded
  );

  return {
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted)),
  };
}