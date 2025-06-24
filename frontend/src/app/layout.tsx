import Header from "@/app/shared/header/header"
import Footer from "@/app/shared/footer/footer"
import { AlertProvider } from "@/app/alerts"
import './globals.css'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200">
        <>
        <AlertProvider>
          <Header />
          <main className="py-8 px-4 sm:px-6 lg:px-8">{children}</main>
          <Footer />
        </AlertProvider>
        </>
      </body>
    </html>
  )
}
