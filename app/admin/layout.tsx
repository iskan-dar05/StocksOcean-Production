import AdminSidebar from '@/components/admin/AdminSidebar'
import { requireAdmin } from '@/lib/admin/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {

  // This runs on server BEFORE rendering
  await requireAdmin()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex gap-[70px] md:gap-0 min-h-screen">
        <AdminSidebar />
        <main className="flex-1 min-h-screen lg:ml-[270px] pt-16 lg:pt-0">
          <div className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}