export default eventHandler(async (event) => {
  const { id, pem } = await readBody<{ id: string; pem: string }>(event);
  console.log(id, pem);
  return hubKV()
    .set(id, pem)
    .then(
      () => true,
      () => false,
    );
});
