'use client'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { ReactNode } from 'react'

const theme = extendTheme({
  colors: {
    brand: {
      50: '#E6F2FF',
      100: '#BAD9FF',
      200: '#8DC0FF',
      300: '#61A7FF',
      400: '#348EFF',
      500: '#0875FF',
      600: '#065DD4',
      700: '#0546A8',
      800: '#032E7D',
      900: '#021751',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
})

export function Providers({ children }: { children: ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>
}