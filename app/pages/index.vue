<script setup lang="ts">
const { data: page } = await useAsyncData("index", () =>
  queryContent("/").findOne(),
);

useSeoMeta({
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description,
});

const toast = useToast();
const pem = useState("publicKey", () => "");

const id = useState("id", () => Math.random().toString(36).substring(2, 7));

const valid = computed(
  () =>
    pem.value.length > 20 &&
    pem.value.startsWith("-----BEGIN PUBLIC KEY-----") &&
    pem.value.endsWith("-----END PUBLIC KEY-----"),
);

const upload = () =>
  $fetch("/api/create", {
    method: "POST",
    body: { id: id.value, pem: pem.value },
  }).then(
    ({ success, error }) =>
      toast.add(
        success
          ? {
              title: "Success",
              color: "green",
            }
          : {
              title: error,
              color: "red",
            },
      ),
    () =>
      toast.add({
        title: "Server Error",
        color: "red",
      }),
  );

const clientId = useState("clientId", () => "");
const clientSecret = useState("clientSecret", () => "");
const loading = useState("loading", () => "");
const register = (region) => {
  loading.value = region;
  return $fetch("/api/register", {
    method: "POST",
    body: {
      id: id.value,
      clientId: clientId.value.trim(),
      clientSecret: clientSecret.value.trim(),
      region,
    },
  })
    .then(
      ({ success, error }) =>
        toast.add(
          success
            ? {
                title: "Success",
                color: "green",
              }
            : {
                title: error,
                color: "red",
              },
        ),
      () =>
        toast.add({
          title: "Server Error",
          color: "red",
        }),
    )
    .finally(() => (loading.value = ""));
};
</script>

<template>
  <div>
    <ULandingHero
      :title="page.hero.title"
      :description="page.hero.description"
      :links="page.hero.links"
    >
      <template #headline>
        <UBadge
          v-if="page.hero.headline"
          variant="subtle"
          size="lg"
          class="relative rounded-full font-semibold"
        >
          <NuxtLink
            :to="page.hero.headline.to"
            target="_blank"
            class="focus:outline-none"
            tabindex="-1"
          >
            <span class="absolute inset-0" aria-hidden="true" />
          </NuxtLink>

          {{ page.hero.headline.label }}

          <UIcon
            v-if="page.hero.headline.icon"
            :name="page.hero.headline.icon"
            class="ml-1 w-4 h-4 pointer-events-none"
          />
        </UBadge>
      </template>
    </ULandingHero>

    <ULandingCTA :title="`Your unique domain is ${id}.fleetkey.net`" card />
    <ULandingSection
      title="Developer Application"
      :description="`Create a Tesla Fleet application and set its origin to https://fleetkey.net, and redirect to https://my.home-assistant.io/redirect/oauth.`"
    >
      <UButton
        to="https://developer.tesla.com/request"
        label="Create Fleet API application"
        target="_blank"
        block
        size="xl"
      />
    </ULandingSection>
    <ULandingSection
      title="Setup integration in Home Assistant"
      description="Now you're ready to add the integration and authorise your account with OAuth. Come back here when prompted to host the public key."
    >
      <UButton
        label="Add integration to Home Assistant"
        icon="i-simple-icons-homeassistant"
        trailing
        color="sky"
        size="xl"
        to="https://my.home-assistant.io/redirect/config_flow_start/?domain=tesla_fleet"
        target="_blank"
        block
      />
    </ULandingSection>
    <ULandingSection
      title="Host Public Key"
      description="Copy and paste the public key from Home Assistant and then click Create."
    >
      <UTextarea
        class="my-4"
        v-model="pem"
        :rows="4"
        autoresize
        placeholder="-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE1FyaPetb5B7G7rL7Sij5L+ZIFawV
m5+vb6BWO6+bItnWq3dO5zjyFEi7N1RCigc9hgKtWPMZSLBi9rvoepv7fQ==
-----END PUBLIC KEY-----"
      />
      <UButton
        :label="`Create ${id}.fleetkey.net`"
        block
        size="xl"
        :disabled="!valid"
        @click="upload"
      />
    </ULandingSection>

    <ULandingSection
      title="Finish setup in Home Assistant"
      description="Home Assistant will now try and register the domain with Tesla. If it doesn't work immediately, try again in a minute."
    />

    <ULandingSection
      title="Add Virtual key to vehicles"
      description="If you missed the QR code to install the virtual key from Home Assistant, here it is again. Scan or tap the QR code with your smartphone."
    >
      <NuxtLink
        :to="`https://tesla.com/_ak/${id}.fleetkey.net`"
        target="_blank"
      >
        <Qrcode
          :value="`https://tesla.com/_ak/${id}.fleetkey.net`"
          style="max-height: 20em; margin: 0 auto"
        />
      </NuxtLink>
    </ULandingSection>

    <NuxtLink to="https://teslemetry.com" target="_blank">
      <ULandingCTA
        title="Is this too hard or confusing?"
        description="Teslemetry is the easy way to get real-time data into Home Assistant. Click here to check it out."
      />
    </NuxtLink>
    <UNotifications :timeout="30000" pause-timeout-on-hover />
  </div>
</template>
