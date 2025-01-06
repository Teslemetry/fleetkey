export default eventHandler(async (event) => {
  const { id, region, clientId, clientSecret } = await readBody<{
    id: string;
    region: string;
    clientId: string;
    clientSecret: string;
  }>(event);

  return $fetch("https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "openid",
      audience: `https://fleet-api.prd.${region}.vn.cloud.tesla.com`,
    }),
  })
    .then((res) =>
      $fetch(
        `https://fleet-api.prd.${region}.vn.cloud.tesla.com/api/1/partner_accounts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${res.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ domain: `${id}.fleetkey.cc` }),
        },
      ).then(() => ({ success: true })),
    )
    .catch((e) => ({ success: false, error: e.response._data.error }));
});
