export default eventHandler(async (event) => {
  const { id, pem } = await readBody<{ id: string; pem: string }>(event);
  if (
    !pem.startsWith("-----BEGIN PUBLIC KEY-----") ||
    !pem.endsWith("-----END PUBLIC KEY-----")
  ) {
    throw createError({
      statusCode: 400,
      message: "Invalid public key format",
    });
  }
  return hubKV()
    .set(id, pem)
    .then(
      () => true,
      () => {
        throw createError({
          statusCode: 500,
          message: "Failed to save public key",
        });
      },
    );
});
