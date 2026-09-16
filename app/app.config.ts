export default defineAppConfig({
  ui: {
    colors: {
      primary: 'indigo',
      info: 'sky',
      neutral: 'zinc'
    },
    icons: {
      close: 'i-heroicons-x-mark-20-solid',
      dark: 'i-heroicons-moon-20-solid',
      light: 'i-heroicons-sun-20-solid'
    },
    button: {
      slots: {
        base: 'rounded-full'
      },
      defaultVariants: {
        color: 'neutral'
      }
    },
    footer: {
      slots: {
        root: 'border-t border-default'
      }
    }
  }
})
