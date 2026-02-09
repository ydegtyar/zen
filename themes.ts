import * as Colors from '@tamagui/colors'
import { createThemes, defaultComponentThemes } from '@tamagui/theme-builder'

const darkPalette = ['hsla(0, 15%, 1%, 1)', 'hsla(0, 15%, 6%, 1)',
  'hsla(0, 15%, 12%, 1)', 'hsla(0, 15%, 17%, 1)', 'hsla(0, 15%, 23%, 1)',
  'hsla(0, 15%, 28%, 1)', 'hsla(0, 15%, 34%, 1)', 'hsla(0, 15%, 39%, 1)',
  'hsla(0, 15%, 45%, 1)', 'hsla(0, 15%, 50%, 1)', 'hsla(0, 15%, 93%, 1)', 'hsla(0, 15%, 99%, 1)']
const lightPalette = ['hsla(0, 15%, 99%, 1)', 'hsla(0, 15%, 94%, 1)',
  'hsla(0, 15%, 88%, 1)', 'hsla(0, 15%, 83%, 1)', 'hsla(0, 15%, 77%, 1)',
  'hsla(0, 15%, 72%, 1)', 'hsla(0, 15%, 66%, 1)', 'hsla(0, 15%, 61%, 1)',
  'hsla(0, 15%, 55%, 1)', 'hsla(0, 15%, 50%, 1)', 'hsla(0, 15%, 15%, 1)',
  'hsla(0, 15%, 1%, 1)']

const lightShadows = {
  shadow1: 'rgba(0,0,0,0.04)',
  shadow2: 'rgba(0,0,0,0.08)',
  shadow3: 'rgba(0,0,0,0.16)',
  shadow4: 'rgba(0,0,0,0.24)',
  shadow5: 'rgba(0,0,0,0.32)',
  shadow6: 'rgba(0,0,0,0.4)',
}

const darkShadows = {
  shadow1: 'rgba(0,0,0,0.2)',
  shadow2: 'rgba(0,0,0,0.3)',
  shadow3: 'rgba(0,0,0,0.4)',
  shadow4: 'rgba(0,0,0,0.5)',
  shadow5: 'rgba(0,0,0,0.6)',
  shadow6: 'rgba(0,0,0,0.7)',
}

const builtThemes = createThemes({
  componentThemes: defaultComponentThemes,

  base: {
    palette: {
      dark: darkPalette,
      light: lightPalette,
    },

    extra: {
      light: {
        ...Colors.gray,
        ...lightShadows,
        shadowColor: lightShadows.shadow1,
        // Input and button colors using gray shades
        inputBackground: '#f8f9fa',
        inputBorder: '#e1e5e9',
        inputText: '#11181C',
        placeholder: '#9ca3af',
        buttonBackground: '#f1f3f4',
        buttonText: '#11181C',
        buttonBorder: '#d1d5db',
        buttonPressed: '#e5e7eb',
        // Status colors using gray shades
        success: '#6b7280',
        warning: '#9ca3af',
        error: '#6b7280',
        info: '#9ca3af',
        green8: '#22c55e',
      },
      dark: {
        ...Colors.grayDark,
        ...darkShadows,
        shadowColor: darkShadows.shadow1,
        // Input and button colors using gray shades
        inputBackground: '#1f2937',
        inputBorder: '#374151',
        inputText: '#f9fafb',
        placeholder: '#6b7280',
        buttonBackground: '#374151',
        buttonText: '#f9fafb',
        buttonBorder: '#4b5563',
        buttonPressed: '#4b5563',
        // Status colors using gray shades
        success: '#9ca3af',
        warning: '#6b7280',
        error: '#9ca3af',
        info: '#6b7280',
        green8: '#22c55e',
      },
    },
  },

  accent: {
    palette: {
      dark: ['hsla(0, 15%, 1%, 1)', 'hsla(0, 15%, 6%, 1)', 'hsla(0, 15%, 12%, 1)', 'hsla(0, 15%, 17%, 1)', 'hsla(0, 15%, 23%, 1)', 'hsla(0, 15%, 28%, 1)', 'hsla(0, 15%, 34%, 1)', 'hsla(0, 15%, 39%, 1)', 'hsla(0, 15%, 45%, 1)', 'hsla(0, 15%, 50%, 1)', 'hsla(0, 15%, 93%, 1)', 'hsla(0, 15%, 99%, 1)'],
      light: ['hsla(0, 15%, 99%, 1)', 'hsla(0, 15%, 94%, 1)', 'hsla(0, 15%, 88%, 1)', 'hsla(0, 15%, 83%, 1)', 'hsla(0, 15%, 77%, 1)', 'hsla(0, 15%, 72%, 1)', 'hsla(0, 15%, 66%, 1)', 'hsla(0, 15%, 61%, 1)', 'hsla(0, 15%, 55%, 1)', 'hsla(0, 15%, 50%, 1)', 'hsla(0, 15%, 15%, 1)', 'hsla(0, 15%, 1%, 1)'],
    },
  },

  childrenThemes: {
    // Using gray shades for status themes instead of colors
    warning: {
      palette: {
        dark: Object.values(Colors.grayDark),
        light: Object.values(Colors.gray),
      },
    },

    error: {
      palette: {
        dark: Object.values(Colors.grayDark),
        light: Object.values(Colors.gray),
      },
    },

    success: {
      palette: {
        dark: Object.values(Colors.grayDark),
        light: Object.values(Colors.gray),
      },
    },
  },

  // optionally add more, can pass palette or template

  // grandChildrenThemes: {
  //   alt1: {
  //     template: 'alt1',
  //   },
  //   alt2: {
  //     template: 'alt2',
  //   },
  //   surface1: {
  //     template: 'surface1',
  //   },
  //   surface2: {
  //     template: 'surface2',
  //   },
  //   surface3: {
  //     template: 'surface3',
  //   },
  // },
})

export type Themes = typeof builtThemes

// the process.env conditional here is optional but saves web client-side bundle
// size by leaving out themes JS. tamagui automatically hydrates themes from CSS
// back into JS for you, and the bundler plugins set TAMAGUI_ENVIRONMENT. so
// long as you are using the Vite, Next, Webpack plugins this should just work,
// but if not you can just export builtThemes directly as themes:
export const themes: Themes =
  process.env.TAMAGUI_ENVIRONMENT === 'client' &&
    process.env.NODE_ENV === 'production'
    ? ({} as any)
    : (builtThemes as any) 