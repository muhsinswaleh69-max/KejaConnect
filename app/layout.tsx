import "./globals.css"

export const metadata = {
  title: "KejaConnect - Find Keja in Mumias",
  description: "List your Keja. KSh 2K/5K Admin. 20% fee first month.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
