import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { TopSellingMenu } from "@/components/dashboard/top-selling-menu"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { RecentOrders } from "@/components/dashboard/recent-orders"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Date display */}
      <div className="flex justify-end">
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Today</p>
          <p className="text-lg font-semibold text-foreground">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Bento Grid - Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TopSellingMenu />
        <QuickStats />
      </div>

      {/* Recent Orders */}
      <RecentOrders />
    </div>
  )
}
