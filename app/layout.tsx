// Root layout — pass-through. <html>/<body> are rendered by [locale]/layout.tsx
// This file must exist so app/page.tsx (root redirect to the default locale) can render.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
