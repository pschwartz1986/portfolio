const PortfolioCrypto = (() => {
  async function deriveKey(password, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );
    const saltBytes = Uint8Array.from(atob(salt), (c) => c.charCodeAt(0));
    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: saltBytes,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async function decrypt(password, ciphertextB64, ivB64, saltB64) {
    const key = await deriveKey(password, saltB64);
    const iv = Uint8Array.from(atob(ivB64), (c) => c.charCodeAt(0));
    const ciphertext = Uint8Array.from(
      atob(ciphertextB64),
      (c) => c.charCodeAt(0)
    );
    try {
      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        ciphertext
      );
      return new TextDecoder().decode(decrypted);
    } catch (e) {
      throw new Error("Decryption failed");
    }
  }

  return { decrypt };
})();
