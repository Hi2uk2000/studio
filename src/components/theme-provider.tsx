// src/components/theme-provider.tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

/**
 * A theme provider component that wraps the `next-themes` provider.
 * It enables theme switching (e.g., light/dark mode) in the application.
 *
 * @param {object} props - The component's props, which are passed to the `next-themes` provider.
 * @param {React.ReactNode} props.children - The child components to render.
 * @returns {JSX.Element} The ThemeProvider component.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
