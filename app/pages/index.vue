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
  }).then(() =>
    window.open(
      `https://${id.value}.fleetkey.cc/.well-known/appspecific/com.tesla.3p.public-key.pem`,
      "_blank",
    ),
  );
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

    <ULandingCTA
      :title="`Your origin domain is https://${id}.fleetkey.cc`"
      card
    />
    <ULandingSection
      title="Step 2"
      :description="`Create a Tesla Fleet application and set its origin to https://${id}.fleetkey.cc, and redirect to https://my.home-assistant.io/redirect/oauth.`"
    >
      <UButton
        to="https://developer.tesla.com/request"
        label="Create Fleet API application"
        target="_blank"
        block
      />
    </ULandingSection>
    <ULandingSection
      title="Step 3"
      description="A public key must be hosted on the application's domain before making calls to Fleet API. The key is used to validate ownership of the domain and provide additional security when using Vehicle Commands and Fleet Telemetry."
    >
      <div>
        <div>
          To generate a public key use
          <br />
          <span class="font-mono font-bold">
            openssl ecparam -name prime256v1 -genkey -noout -out private-key.pem
          </span>
          <br />
          then
          <br />
          <span class="font-mono font-bold">
            openssl ec -in private-key.pem -pubout -out public-key.pem
          </span>
          <br />
          then paste the public key contents below.
        </div>

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
          :label="`Create ${id}.fleetkey.cc`"
          @click="upload"
          :disabled="!valid"
          block
        />
      </div>
    </ULandingSection>
    <ULandingSection
      title="Step 4"
      description="Generate a partner authentication token and use it to call the register endpoint to complete registration with Fleet API."
      :links="{
        label: 'Documentation',
        to: 'https://developer.tesla.com/docs/fleet-api/getting-started/what-is-fleet-api#step-3-generate-a-public-private-key-pair',
      }"
    >
      More on this step coming soon
    </ULandingSection>
  </div>
</template>
