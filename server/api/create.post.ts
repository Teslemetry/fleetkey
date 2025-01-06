export default eventHandler(async (event) => {
  const { id, pem } = await readBody<{ id: string; pem: string }>(event);
  if (
    !pem.startsWith("-----BEGIN PUBLIC KEY-----") ||
    !pem.endsWith("-----END PUBLIC KEY-----")
  ) {
    return {
      success: false,
      error: "Invalid public key format",
    };
  }
  const kv = hubKV();

  return kv.has(id).then((exists) => {
    if (exists) {
      return {
        success: false,
        error: "Public key already exists",
      };
    }
    return kv.set(id, pem).then(
      () => ({ success: true }),
      () => ({ success: false, error: "Failed to save public key" }),
    );
  });
});
