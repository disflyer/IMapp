import { NextUIProvider } from '@nextui-org/react'
import { TRPCReactProvider } from 'trpc/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <TRPCReactProvider>
        {children}
      </TRPCReactProvider>
    </NextUIProvider>
  )
}