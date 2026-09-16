<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

useSeoMeta({
  title: 'Fleet Key for Home Assistant',
  ogTitle: 'Fleet Key for Home Assistant',
  description: 'Host your Tesla Fleet API public key for free',
  ogDescription: 'Host your Tesla Fleet API public key for free'
})

const links: ButtonProps[] = [
  {
    label: 'Home Assistant Documentation',
    icon: 'i-simple-icons-homeassistant',
    trailing: true,
    to: 'https://www.home-assistant.io/integrations/tesla_fleet/',
    size: 'xl'
  },
  {
    label: 'Tesla Fleet API Documentation',
    icon: 'i-simple-icons-tesla',
    trailing: true,
    size: 'xl',
    variant: 'outline',
    to: 'https://developer.tesla.com/docs/fleet-api/getting-started/what-is-fleet-api#step-3-generate-a-public-private-key-pair',
    target: '_blank'
  }
]

type ApiResult = { success: boolean, error?: string }

const toast = useToast()
const pem = useState('publicKey', () => '')

const id = useState('id', () => Math.random().toString(36).substring(2, 7))

const valid = computed(
  () =>
    pem.value.length > 20
    && pem.value.startsWith('-----BEGIN PUBLIC KEY-----')
    && pem.value.endsWith('-----END PUBLIC KEY-----')
)

const upload = () =>
  $fetch<ApiResult>('/api/create', {
    method: 'POST',
    body: { id: id.value, pem: pem.value }
  }).then(
    ({ success, error }) =>
      toast.add(
        success
          ? {
              title: 'Success',
              color: 'success'
            }
          : {
              title: error,
              color: 'error'
            }
      ),
    () =>
      toast.add({
        title: 'Server Error',
        color: 'error'
      })
  )
</script>

<template>
  <div>
    <UPageHero
      title="Fleet Key"
      description="Host your Tesla Fleet API public key for the Home Assistant Tesla Fleet integration."
      :links="links"
    >
      <template #headline>
        <UBadge
          variant="subtle"
          size="lg"
          class="relative rounded-full font-semibold"
        >
          <NuxtLink
            to="https://teslemetry.com"
            target="_blank"
            class="focus:outline-none"
            tabindex="-1"
          >
            <span
              class="absolute inset-0"
              aria-hidden="true"
            />
          </NuxtLink>

          Provided by Teslemetry.com

          <UIcon
            name="i-heroicons-arrow-top-right-on-square-20-solid"
            class="ml-1 w-4 h-4 pointer-events-none"
          />
        </UBadge>
      </template>
    </UPageHero>

    <UPageCTA :title="`Your unique domain is ${id}.fleetkey.net`" />
    <UPageSection
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
    </UPageSection>
    <UPageSection
      title="Setup integration in Home Assistant"
      description="Now you're ready to add the integration and authorise your account with OAuth. Come back here when prompted to host the public key."
    >
      <UButton
        label="Add integration to Home Assistant"
        icon="i-simple-icons-homeassistant"
        trailing
        color="info"
        size="xl"
        to="https://my.home-assistant.io/redirect/config_flow_start/?domain=tesla_fleet"
        target="_blank"
        block
        :ui="{ trailingIcon: 'ms-0' }"
      />
    </UPageSection>
    <UPageSection
      title="Host Public Key"
      description="Copy and paste the public key from Home Assistant and then click Create."
    >
      <UTextarea
        v-model="pem"
        class="my-4"
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
    </UPageSection>

    <UPageSection
      title="Finish setup in Home Assistant"
      description="Home Assistant will now try and register the domain with Tesla. If it doesn't work immediately, try again in a minute."
    />

    <UPageSection
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
    </UPageSection>

    <NuxtLink
      to="https://teslemetry.com"
      target="_blank"
    >
      <UPageCTA
        title="Is this too hard or confusing?"
        description="Teslemetry is the easy way to get real-time data into Home Assistant. Click here to check it out."
      />
    </NuxtLink>
  </div>
</template>
