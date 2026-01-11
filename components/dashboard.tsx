"use client"

import { TrendingUp, Users, Coffee, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card } from "@/components/ui/card"

const stats = [
  {
    title: "Total Sales",
    value: "Rp 12.5M",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    description: "vs last month",
  },
  {
    title: "Active Members",
    value: "1,234",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    description: "registered customers",
  },
  {
    title: "Orders Today",
    value: "89",
    change: "-3.1%",
    trend: "down",
    icon: Coffee,
    description: "vs yesterday",
  },
  {
    title: "Growth Rate",
    value: "23.5%",
    change: "+5.4%",
    trend: "up",
    icon: TrendingUp,
    description: "monthly average",
  },
]

const topSelling = [
  { name: "Kopi Susu Gula Aren", sales: 234, price: "Rp 25.000" },
  { name: "Americano", sales: 189, price: "Rp 22.000" },
  { name: "Cappuccino", sales: 156, price: "Rp 28.000" },
  { name: "Es Kopi Vietnam", sales: 142, price: "Rp 26.000" },
  { name: "Matcha Latte", sales: 98, price: "Rp 30.000" },
]

const recentOrders = [
  { id: "ORD-001", customer: "Budi Santoso", items: 3, total: "Rp 75.000", status: "Completed" },
  { id: "ORD-002", customer: "Siti Nurhaliza", items: 2, total: "Rp 52.000", status: "Processing" },
  { id: "ORD-003", customer: "Ahmad Dahlan", items: 1, total: "Rp 25.000", status: "Completed" },
  { id: "ORD-004", customer: "Dewi Lestari", items: 4, total: "Rp 110.000", status: "Completed" },
]

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back to PowerCoffee</p>
        </div>
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

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={index}
              className="glass p-5 rounded-2xl border-0 hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    stat.trend === "up" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stat.change}
                  {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                <p className="text-xs text-muted-foreground/70 mt-0.5">{stat.description}</p>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Bento Grid - Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Selling Menu - Large Card */}
        <Card className="glass p-6 rounded-2xl border-0 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Top Selling Menu</h2>
            <span className="text-xs text-muted-foreground px-3 py-1 bg-secondary rounded-full">This Week</span>
          </div>
          <div className="space-y-4">
            {topSelling.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.price}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-accent">{item.sales}</p>
                  <p className="text-xs text-muted-foreground">sold</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Stats Card */}
        <Card className="glass p-6 rounded-2xl border-0">
          <h2 className="text-xl font-bold text-foreground mb-6">Quick Stats</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Daily Target</span>
                <span className="text-foreground font-medium">78%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full w-[78%] bg-primary rounded-full" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Stock Level</span>
                <span className="text-foreground font-medium">92%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full w-[92%] bg-accent rounded-full" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Member Growth</span>
                <span className="text-foreground font-medium">65%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full w-[65%] bg-chart-2 rounded-full" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="glass p-6 rounded-2xl border-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Recent Orders</h2>
          <button className="text-sm text-accent hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-muted-foreground border-b border-border">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Items</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={index} className="border-b border-border/50 last:border-0">
                  <td className="py-4 font-mono text-sm text-foreground">{order.id}</td>
                  <td className="py-4 text-foreground">{order.customer}</td>
                  <td className="py-4 text-muted-foreground">{order.items} items</td>
                  <td className="py-4 font-medium text-foreground">{order.total}</td>
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "Completed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
