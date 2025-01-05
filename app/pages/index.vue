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

const router = useRouter();

const pem = useState("publicKey", () => "");

const id = Math.random().toString(36).substring(2, 15);

const valid = computed(
  () =>
    pem.value.length > 20 &&
    pem.value.startsWith("-----BEGIN PUBLIC KEY-----") &&
    pem.value.endsWith("-----END PUBLIC KEY-----"),
);

const upload = () =>
  $fetch("/api/create", { method: "POST", body: { id, pem } }).then(() =>
    router.push(
      `https://${id}.fleetkey.teslemetry.xyz/.well-known/appspecific/com.tesla.3p.public-key.pem`,
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

    <ULandingSection
      headline="Upload your public key to"
      :title="`${id}.fleetkey.teslemetry.xyz`"
    >
      <div>
        <pre>
          openssl ecparam -name prime256v1 -genkey -noout -out private-key.pem
          openssl ec -in private-key.pem -pubout -out public-key.pem
        </pre>

        <UTextarea
          v-model="pem"
          :rows="4"
          autoresize
          placeholder="-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE1FyaPetb5B7G7rL7Sij5L+ZIFawV
m5+vb6BWO6+bItnWq3dO5zjyFEi7N1RCigc9hgKtWPMZSLBi9rvoepv7fQ==
-----END PUBLIC KEY-----"
        />
        <UButton
          class="mt-4"
          :label="`Upload to ${id}.fleetkey.teslemetry.xyz`"
          @click="upload"
          :disabled="!valid"
          block
        />
      </div>
    </ULandingSection>
  </div>
</template>
