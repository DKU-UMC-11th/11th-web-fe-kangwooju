import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Footer } from '../components/layout/footer'
import { Header } from '../components/layout/header'

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col bg-[#f4f6f8]">
      <Header />
      <Outlet />
      <Footer />
    </div>
  ),
  notFoundComponent: () => (
    <main className="mx-auto flex min-h-[calc(100vh-178px)] w-[min(1120px,calc(100%-48px))] items-center justify-center text-2xl font-bold">
      페이지를 찾을 수 없어요.
    </main>
  ),
})
